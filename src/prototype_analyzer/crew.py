from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from prototype_analyzer.tools.github_client import GitHubMCPClient
from prototype_analyzer.models.prd_models import (
    ProjectMetadata, BrandFoundations, TargetAudienceSegment,
    PositioningAndMessaging, VisualIdentity, CompetitiveAnalysis,
    ProblemDefinition, SolutionOverview, CustomerProfile,
    LeanCanvas, TechnicalArchitecture
)
import os

@CrewBase
class PrototypeAnalyzer():
    """Prototype Analyzer crew for extracting PRD from GitHub repositories"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    def __init__(self):
        super().__init__()
        # Initialize GitHub client
        self.github_client = GitHubMCPClient()

    @agent
    def project_metadata_extractor(self) -> Agent:
        return Agent(
            config=self.agents_config['project_metadata_extractor'],
            verbose=True
        )

    @agent
    def brand_foundations_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['brand_foundations_analyst'],
            verbose=True
        )

    @agent
    def target_audience_researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['target_audience_researcher'],
            verbose=True
        )

    @agent
    def positioning_messaging_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['positioning_messaging_expert'],
            verbose=True
        )

    @agent
    def visual_identity_extractor(self) -> Agent:
        return Agent(
            config=self.agents_config['visual_identity_extractor'],
            verbose=True
        )

    @agent
    def competitive_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['competitive_analyst'],
            verbose=True
        )

    @agent
    def problem_definition_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['problem_definition_specialist'],
            verbose=True
        )

    @agent
    def solution_overview_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['solution_overview_expert'],
            verbose=True
        )

    @agent
    def customer_profile_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['customer_profile_analyst'],
            verbose=True
        )

    @agent
    def lean_canvas_extractor(self) -> Agent:
        return Agent(
            config=self.agents_config['lean_canvas_extractor'],
            verbose=True
        )

    @agent
    def technical_architecture_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['technical_architecture_analyst'],
            verbose=True
        )

    @task
    def extract_project_metadata(self) -> Task:
        return Task(
            config=self.tasks_config['extract_project_metadata'],
            output_pydantic=ProjectMetadata
        )

    @task
    def extract_brand_foundations(self) -> Task:
        return Task(
            config=self.tasks_config['extract_brand_foundations'],
            output_pydantic=BrandFoundations
        )

    @task
    def extract_target_audience(self) -> Task:
        return Task(
            config=self.tasks_config['extract_target_audience']
        )

    @task
    def extract_positioning_messaging(self) -> Task:
        return Task(
            config=self.tasks_config['extract_positioning_messaging'],
            output_pydantic=PositioningAndMessaging
        )

    @task
    def extract_visual_identity(self) -> Task:
        return Task(
            config=self.tasks_config['extract_visual_identity'],
            output_pydantic=VisualIdentity
        )

    @task
    def extract_competitive_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['extract_competitive_analysis'],
            output_pydantic=CompetitiveAnalysis
        )

    @task
    def extract_problem_definition(self) -> Task:
        return Task(
            config=self.tasks_config['extract_problem_definition'],
            output_pydantic=ProblemDefinition
        )

    @task
    def extract_solution_overview(self) -> Task:
        return Task(
            config=self.tasks_config['extract_solution_overview'],
            output_pydantic=SolutionOverview
        )

    @task
    def extract_customer_profiles(self) -> Task:
        return Task(
            config=self.tasks_config['extract_customer_profiles']
        )

    @task
    def extract_lean_canvas(self) -> Task:
        return Task(
            config=self.tasks_config['extract_lean_canvas'],
            output_pydantic=LeanCanvas
        )

    @task
    def extract_technical_architecture(self) -> Task:
        return Task(
            config=self.tasks_config['extract_technical_architecture'],
            output_pydantic=TechnicalArchitecture
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Prototype Analyzer crew with parallel execution"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,  # Tasks run in parallel due to async_execution=True
            verbose=True
        )
