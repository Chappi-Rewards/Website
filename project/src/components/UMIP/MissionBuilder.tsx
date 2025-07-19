import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Move, 
  Settings, 
  Eye, 
  Save, 
  Play,
  Target,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Smartphone,
  MessageCircle,
  Radio,
  Store,
  Image,
  Video,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { COLORS, ICON_SIZES } from '../../utils/constants';

interface MissionStep {
  id: string;
  type: 'action' | 'condition' | 'reward' | 'verification';
  title: string;
  description: string;
  config: {
    [key: string]: any;
  };
  position: { x: number; y: number };
  connections: string[];
}

interface MissionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedCompletion: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: MissionStep[];
}

export const MissionBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [missionSteps, setMissionSteps] = useState<MissionStep[]>([]);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const stepTypes = [
    {
      type: 'action',
      title: 'User Action',
      description: 'Require user to perform an action',
      icon: <Target className="w-5 h-5" />,
      color: COLORS.primary
    },
    {
      type: 'condition',
      title: 'Condition Check',
      description: 'Check if conditions are met',
      icon: <CheckCircle className="w-5 h-5" />,
      color: COLORS.secondary
    },
    {
      type: 'reward',
      title: 'Reward',
      description: 'Give reward to user',
      icon: <DollarSign className="w-5 h-5" />,
      color: COLORS.accent
    },
    {
      type: 'verification',
      title: 'Verification',
      description: 'Verify user action',
      icon: <CheckCircle className="w-5 h-5" />,
      color: COLORS.neutral
    }
  ];

  const missionTemplates: MissionTemplate[] = [
    {
      id: 'template_1',
      name: 'Product Purchase Mission',
      description: 'User purchases a specific product and shares feedback',
      category: 'Shopping',
      estimatedCompletion: '15 minutes',
      difficulty: 'easy',
      steps: [
        {
          id: 'step_1',
          type: 'action',
          title: 'Visit Store',
          description: 'User visits participating retail location',
          config: {
            actionType: 'location_visit',
            requiredLocation: 'retail_partner',
            verificationMethod: 'gps'
          },
          position: { x: 100, y: 100 },
          connections: ['step_2']
        },
        {
          id: 'step_2',
          type: 'action',
          title: 'Purchase Product',
          description: 'User purchases specified product',
          config: {
            actionType: 'purchase',
            productCategory: 'fmcg',
            minimumAmount: 10
          },
          position: { x: 300, y: 100 },
          connections: ['step_3']
        },
        {
          id: 'step_3',
          type: 'verification',
          title: 'Verify Purchase',
          description: 'Verify purchase through receipt or blockchain',
          config: {
            verificationMethod: 'receipt_scan',
            confidenceThreshold: 0.8
          },
          position: { x: 500, y: 100 },
          connections: ['step_4']
        },
        {
          id: 'step_4',
          type: 'reward',
          title: 'Award Chapps',
          description: 'Give user reward for completion',
          config: {
            rewardType: 'chapps',
            amount: 25
          },
          position: { x: 700, y: 100 },
          connections: []
        }
      ]
    },
    {
      id: 'template_2',
      name: 'Social Sharing Mission',
      description: 'User tries product and shares on social media',
      category: 'Social',
      estimatedCompletion: '30 minutes',
      difficulty: 'medium',
      steps: [
        {
          id: 'step_1',
          type: 'action',
          title: 'Product Trial',
          description: 'User tries the product',
          config: {
            actionType: 'product_trial',
            duration: 'immediate'
          },
          position: { x: 100, y: 100 },
          connections: ['step_2']
        },
        {
          id: 'step_2',
          type: 'action',
          title: 'Share Experience',
          description: 'User shares experience on social media',
          config: {
            actionType: 'social_share',
            platforms: ['whatsapp', 'facebook', 'instagram'],
            requiredHashtags: ['#ChappiRewards']
          },
          position: { x: 300, y: 100 },
          connections: ['step_3']
        },
        {
          id: 'step_3',
          type: 'verification',
          title: 'Verify Share',
          description: 'Verify social media post',
          config: {
            verificationMethod: 'social_api',
            requiredEngagement: 5
          },
          position: { x: 500, y: 100 },
          connections: ['step_4']
        },
        {
          id: 'step_4',
          type: 'reward',
          title: 'Bonus Reward',
          description: 'Extra reward for social engagement',
          config: {
            rewardType: 'chapps',
            amount: 50
          },
          position: { x: 700, y: 100 },
          connections: []
        }
      ]
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = missionTemplates.find(t => t.id === templateId);
    if (template) {
      setMissionSteps(template.steps);
      setSelectedTemplate(templateId);
    }
  };

  const handleDragStart = (stepId: string) => {
    setDraggedStep(stepId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedStep || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMissionSteps(prev => prev.map(step => 
      step.id === draggedStep 
        ? { ...step, position: { x, y } }
        : step
    ));

    setDraggedStep(null);
  };

  const addNewStep = (type: string) => {
    const newStep: MissionStep = {
      id: `step_${Date.now()}`,
      type: type as any,
      title: `New ${type}`,
      description: `Configure this ${type} step`,
      config: {},
      position: { x: 200, y: 200 },
      connections: []
    };

    setMissionSteps(prev => [...prev, newStep]);
  };

  const deleteStep = (stepId: string) => {
    setMissionSteps(prev => prev.filter(step => step.id !== stepId));
    if (selectedStep === stepId) {
      setSelectedStep(null);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'action': return <Target className="w-4 h-4" />;
      case 'condition': return <CheckCircle className="w-4 h-4" />;
      case 'reward': return <DollarSign className="w-4 h-4" />;
      case 'verification': return <CheckCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'action': return COLORS.primary;
      case 'condition': return COLORS.secondary;
      case 'reward': return COLORS.accent;
      case 'verification': return COLORS.neutral;
      default: return COLORS.primary;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.light }}>
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.primary }}>
                Mission Builder
              </h1>
              <p className="text-sm md:text-base" style={{ color: COLORS.text.secondary }}>
                Create engaging missions with drag-and-drop interface
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant={isPreviewMode ? "primary" : "outline"}
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {isPreviewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button variant="primary" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Publish Mission
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Templates & Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mission Templates */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4">
              <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.text.primary }}>
                Mission Templates
              </h3>
              <div className="space-y-3">
                {missionTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedTemplate === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <h4 className="font-semibold text-sm mb-1" style={{ color: COLORS.text.primary }}>
                      {template.name}
                    </h4>
                    <p className="text-xs mb-2" style={{ color: COLORS.text.secondary }}>
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className="px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${COLORS.primary}10`,
                          color: COLORS.primary
                        }}
                      >
                        {template.category}
                      </span>
                      <span style={{ color: COLORS.text.secondary }}>
                        {template.estimatedCompletion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Types */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4">
              <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.text.primary }}>
                Step Types
              </h3>
              <div className="space-y-2">
                {stepTypes.map((stepType) => (
                  <div
                    key={stepType.type}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => addNewStep(stepType.type)}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ color: stepType.color }}>
                        {stepType.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm" style={{ color: COLORS.text.primary }}>
                          {stepType.title}
                        </h4>
                        <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                          {stepType.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Settings */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4">
              <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.text.primary }}>
                Mission Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Mission Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter mission name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Target Audience
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>All Users</option>
                    <option>New Users</option>
                    <option>Returning Users</option>
                    <option>High-Value Customers</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Budget Allocation
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter budget"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold" style={{ color: COLORS.text.primary }}>
                  Mission Flow
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                    {missionSteps.length} steps
                  </span>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <div
                ref={canvasRef}
                className="relative w-full h-96 border-2 border-dashed border-gray-300 rounded-lg overflow-auto"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ minHeight: '600px' }}
              >
                {missionSteps.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Target className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.neutral }} />
                      <p className="text-lg font-medium mb-2" style={{ color: COLORS.text.primary }}>
                        Start Building Your Mission
                      </p>
                      <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                        Select a template or drag step types to begin
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {missionSteps.map((step) =>
                        step.connections.map((connectionId) => {
                          const targetStep = missionSteps.find(s => s.id === connectionId);
                          if (!targetStep) return null;

                          return (
                            <line
                              key={`${step.id}-${connectionId}`}
                              x1={step.position.x + 60}
                              y1={step.position.y + 30}
                              x2={targetStep.position.x + 60}
                              y2={targetStep.position.y + 30}
                              stroke={COLORS.primary}
                              strokeWidth="2"
                              markerEnd="url(#arrowhead)"
                            />
                          );
                        })
                      )}
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill={COLORS.primary}
                          />
                        </marker>
                      </defs>
                    </svg>

                    {/* Mission Steps */}
                    {missionSteps.map((step) => (
                      <div
                        key={step.id}
                        className={`absolute w-32 h-20 rounded-lg border-2 cursor-move transition-all duration-300 ${
                          selectedStep === step.id 
                            ? 'border-blue-500 shadow-lg' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{
                          left: step.position.x,
                          top: step.position.y,
                          backgroundColor: `${getStepColor(step.type)}10`
                        }}
                        draggable
                        onDragStart={() => handleDragStart(step.id)}
                        onClick={() => setSelectedStep(step.id)}
                      >
                        <div className="p-2 h-full flex flex-col">
                          <div className="flex items-center justify-between mb-1">
                            <div style={{ color: getStepColor(step.type) }}>
                              {getStepIcon(step.type)}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteStep(step.id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <h4 className="text-xs font-semibold mb-1" style={{ color: COLORS.text.primary }}>
                            {step.title}
                          </h4>
                          <p className="text-xs flex-1 overflow-hidden" style={{ color: COLORS.text.secondary }}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Step Configuration Panel */}
              {selectedStep && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-4" style={{ color: COLORS.text.primary }}>
                    Configure Step
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                        Step Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={missionSteps.find(s => s.id === selectedStep)?.title || ''}
                        onChange={(e) => {
                          setMissionSteps(prev => prev.map(step =>
                            step.id === selectedStep
                              ? { ...step, title: e.target.value }
                              : step
                          ));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                        Description
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={missionSteps.find(s => s.id === selectedStep)?.description || ''}
                        onChange={(e) => {
                          setMissionSteps(prev => prev.map(step =>
                            step.id === selectedStep
                              ? { ...step, description: e.target.value }
                              : step
                          ));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};