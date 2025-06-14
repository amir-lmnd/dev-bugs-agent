### Services Catalog

#### blender-frontend

- **Tech Stack**: React/TypeScript frontend monorepo
- **Purpose**: UI code for an application called "blender" which is a backoffice system for managing claims in the beloved insurance company we work for.
- **Additional Info**: Most time the user journey of the users that reports bugs starts here. It contains UI code for multiple insurnace products, we will focus on Home & renters insurance flows.

#### home-blender

- **Tech Stack**: NestJS + TypeScript + PostgreSQL + TypeORM
- **Purpose**: This is a 'backend for frontend' serivce specifically for the Blender FE. It has tons of data apis for the UI and also mutating operations for all the claim and policy flows in Blender. It mainly connects the UI to the domain services, such as: home-claims, monolith, etc. This service holds all the configuration for the claim workflow. "workflow" is a skeleton of tasks that needs to be completed to handle the incoming claims. The workflows tasks often vary dpending on the claim, there is ton of logic around that.

#### blender-general

- **Tech Stack**: NestJS + TypeScript + PostgreSQL + TypeORM
- **Purpose**: This is yet another 'backend for frontend' serivce but unlike 'home-blender' it has all the shared flows that aren't insurance line specific.

#### **lemonade** (aka: "monolith", "legacy claims client")

- **Tech Stack**: Ruby on Rails
- **Purpose**: Core flow for managing claim + policy entities.
- **Additional Info**: services like home-blender, home-claims are calling it to query claim data and mutating claims entities

#### **clx-service**:

- **Tech Stack**: NestJS + TypeScript + PostgreSQL + TypeORM
- **Purpose**: Multi-product claims experience. it has: Adjusters management, user surveys, backend for queuing system in Blender that shows the adjuster the status of all the claim assigned to him. Task prioritization logic, and more!

#### **home-claims-service**

- **Tech Stack**: NestJS + TypeScript + PostgreSQL + TypeORM
- **Purpose**: Home-specific claims processing. Its the alternative for the monolith that manages the claims module. It has: coverages decisions, claim tracker management, vendor management and payment flows, claim item appraisals and more!

#### **bionics-platform**

- **Tech Stack**: NestJS + TypeScript + PostgreSQL + TypeORM
- **Purpose**: attachments, fraud detection, SIU, claim trackers (a backend for a ui component that gives the users in the app general understanding of where we are in the claim handling process)

#### **billing-service**

- **Tech Stack**: NX + TypeScript + NestJS
- **Purpose**: payments, billing
- **Additional Info**: all payments initiation and data comes from here.

#### **workflow-service**

- **Tech Stack**: NestJS + TypeScript + PostgreSQL + TypeORM
- **Purpose**: workflow management. "Workflows" is a skeleton of tasks that needs to be completed to handle the incoming claims.
