"""Pydantic models for PRD extraction output"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class ProjectMetadata(BaseModel):
    """Project basic information and metadata"""
    name: str = Field(default="not found", description="Project title")
    client: str = Field(default="not found", description="Client organization name")
    date: str = Field(default="not found", description="Project date")
    description: str = Field(default="not found", description="Project overview")


class BrandFoundations(BaseModel):
    """Brand foundations and core values"""
    brandDescription: str = Field(default="not found")
    mission: str = Field(default="not found")
    vision: str = Field(default="not found")
    coreValues: List[str] = Field(default_factory=lambda: ["not found"])
    problemStatement: str = Field(default="not found")
    solutionStatement: str = Field(default="not found")
    toneOfVoice: List[str] = Field(default_factory=lambda: ["not found"])
    brandEthos: str = Field(default="not found")
    brandArchetype: str = Field(default="not found")
    brandPromise: str = Field(default="not found")


class TargetAudienceSegment(BaseModel):
    """Individual target audience segment"""
    name: str = Field(default="not found")
    segment: str = Field(default="not found")
    role: str = Field(default="not found")
    techComfort: str = Field(default="not found")
    demographics: str = Field(default="not found")
    psychographics: str = Field(default="not found")
    goals: List[str] = Field(default_factory=lambda: ["not found"])
    painPoints: List[str] = Field(default_factory=lambda: ["not found"])
    behaviours: List[str] = Field(default_factory=lambda: ["not found"])
    geography: str = Field(default="not found")
    jobsToBeDone: List[str] = Field(default_factory=lambda: ["not found"])


class PositioningAndMessaging(BaseModel):
    """Market positioning and messaging"""
    tagline: str = Field(default="not found")
    positioningStatement: str = Field(default="not found")
    elevatorPitch: str = Field(default="not found")
    messagingPillars: List[str] = Field(default_factory=lambda: ["not found"])
    coreHooks: List[str] = Field(default_factory=lambda: ["not found"])
    narrativeFragments: List[str] = Field(default_factory=lambda: ["not found"])


class TypographyConfig(BaseModel):
    """Typography configuration"""
    headingFont: str = Field(default="not found")
    bodyFont: str = Field(default="not found")


class DesignInspiration(BaseModel):
    """Design inspiration reference"""
    site: str = Field(default="not found")
    notes: str = Field(default="not found")


class VisualIdentity(BaseModel):
    """Visual identity and design system"""
    primaryColor: str = Field(default="not found")
    secondaryColors: List[str] = Field(default_factory=lambda: ["not found"])
    typography: TypographyConfig = Field(default_factory=TypographyConfig)
    logoPrimary: str = Field(default="not found")
    logoSecondary: str = Field(default="not found")
    symbol: str = Field(default="not found")
    imageryGuidelines: List[str] = Field(default_factory=lambda: ["not found"])
    designInspiration: List[DesignInspiration] = Field(default_factory=list)
    mockupExamples: List[str] = Field(default_factory=lambda: ["not found"])


class DifferentiationStrategy(BaseModel):
    """Market differentiation strategy"""
    keyOpportunities: List[str] = Field(default_factory=lambda: ["not found"])
    uniqueSellingPoints: List[str] = Field(default_factory=lambda: ["not found"])
    whiteSpaceInsights: str = Field(default="not found")
    blueOceanIndicators: List[str] = Field(default_factory=lambda: ["not found"])


class CompetitiveAnalysis(BaseModel):
    """Competitive landscape analysis"""
    marketCategory: str = Field(default="not found")
    positioningSummary: str = Field(default="not found")
    comparativeDimensions: List[str] = Field(default_factory=lambda: ["not found"])
    competitors: List[str] = Field(default_factory=lambda: ["not found"])
    differentiationStrategy: DifferentiationStrategy = Field(default_factory=DifferentiationStrategy)
    visualReferences: List[str] = Field(default_factory=lambda: ["not found"])


class ProblemDefinition(BaseModel):
    """Problem definition and context"""
    context: str = Field(default="not found")
    primaryProblem: str = Field(default="not found")
    secondaryProblems: List[str] = Field(default_factory=lambda: ["not found"])
    businessImpact: str = Field(default="not found")
    userPainPoints: List[str] = Field(default_factory=lambda: ["not found"])
    hypotheses: List[str] = Field(default_factory=lambda: ["not found"])
    constraints: List[str] = Field(default_factory=lambda: ["not found"])


class SolutionOverview(BaseModel):
    """Solution overview and features"""
    valueProposition: str = Field(default="not found")
    keyFeatures: List[str] = Field(default_factory=lambda: ["not found"])
    differentiators: List[str] = Field(default_factory=lambda: ["not found"])
    outOfScopeForNow: List[str] = Field(default_factory=lambda: ["not found"])
    nonFunctionalRequirements: List[str] = Field(default_factory=lambda: ["not found"])


class CustomerProfile(BaseModel):
    """Customer profile definition"""
    description: str = Field(default="not found")
    organisationType: List[str] = Field(default_factory=lambda: ["not found"])
    teamSizeRange: str = Field(default="not found")
    currentTools: List[str] = Field(default_factory=lambda: ["not found"])
    triggerEvents: List[str] = Field(default_factory=lambda: ["not found"])
    successSignals: List[str] = Field(default_factory=lambda: ["not found"])
    regions: List[str] = Field(default_factory=lambda: ["not found"])
    budgetRange: str = Field(default="not found")
    maturityLevel: str = Field(default="not found")
    keyStakeholders: List[str] = Field(default_factory=lambda: ["not found"])


class LeanCanvas(BaseModel):
    """Lean canvas business model"""
    uniqueValueProposition: str = Field(default="not found")
    unfairAdvantage: str = Field(default="not found")
    customerSegments: List[str] = Field(default_factory=lambda: ["not found"])
    existingAlternatives: List[str] = Field(default_factory=lambda: ["not found"])
    keyMetrics: List[str] = Field(default_factory=lambda: ["not found"])
    highLevelConcept: str = Field(default="not found")
    channels: List[str] = Field(default_factory=lambda: ["not found"])
    costStructure: List[str] = Field(default_factory=lambda: ["not found"])
    revenueStreams: List[str] = Field(default_factory=lambda: ["not found"])


class TechnicalArchitecture(BaseModel):
    """Technical architecture and implementation details"""
    techStack: List[str] = Field(default_factory=lambda: ["not found"])
    dependencies: List[str] = Field(default_factory=lambda: ["not found"])
    apiEndpoints: List[str] = Field(default_factory=lambda: ["not found"])
    databaseSchema: str = Field(default="not found")
    deploymentNotes: str = Field(default="not found")


class PRDOutput(BaseModel):
    """Complete PRD extraction output"""
    project: ProjectMetadata
    brandFoundations: BrandFoundations
    targetAudience: List[TargetAudienceSegment]
    desiredEmotions: List[str] = Field(default_factory=lambda: ["not found"])
    positioningAndMessaging: PositioningAndMessaging
    visualIdentity: VisualIdentity
    competitiveAnalysis: CompetitiveAnalysis
    problemDefinition: ProblemDefinition
    solutionOverview: SolutionOverview
    customerProfiles: Dict[str, CustomerProfile]
    leanCanvas: LeanCanvas
    technicalArchitecture: TechnicalArchitecture
