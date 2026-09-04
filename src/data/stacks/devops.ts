import { Question } from '../../types';

export const DEVOPS_QUESTIONS: Question[] = [
  {
    id: 'devops-1',
    stack: 'devops',
    topic: 'CI/CD Pipelines',
    title: 'What is CI/CD, and why is it important?',
    difficulty: 'Beginner',
    summary: 'Continuous Integration (CI) and Continuous Deployment (CD) automate the process of testing, building, and deploying code.',
    explanation: [
      'Continuous Integration (CI): Whenever developers push code to GitHub, an automated server (like GitHub Actions, GitLab CI, or Jenkins) builds the app and runs all unit tests. This ensures new code doesn\'t break existing features.',
      'Continuous Deployment (CD): If the CI tests pass, the CD pipeline automatically deploys the code to a staging or production server. No human manual intervention is required.',
      'Importance: Reduces human error (no more "it works on my machine"), speeds up release cycles, and ensures the codebase is always in a deployable state.'
    ],
    keyPoints: [
      'CI = Automated Testing & Building.',
      'CD = Automated Deployment.'
    ],
    tags: ['DevOps', 'CI/CD', 'Deployment', 'Automation']
  },
  {
    id: 'devops-2',
    stack: 'devops',
    topic: 'Containerization',
    title: 'What is Docker? What is the difference between an Image and a Container?',
    difficulty: 'Intermediate',
    summary: 'Docker is a platform for developing, shipping, and running applications in isolated environments called containers. It solves the "it works on my machine" problem.',
    explanation: [
      'The Problem: An app works on a developer\'s Mac, but crashes on the Linux production server because of different OS versions, missing dependencies, or conflicting Python/Node versions.',
      'The Solution (Docker): Docker packages the application code ALONG WITH the OS, runtime, libraries, and dependencies into a single isolated unit.',
      'Docker Image: A read-only template or blueprint containing the OS, application code, and dependencies (Analogy: A class definition in OOP).',
      'Docker Container: A running instance of a Docker Image (Analogy: An instantiated object in OOP). You can run multiple identical containers from a single image.'
    ],
    codeExample: {
      language: 'dockerfile',
      filename: 'Dockerfile',
      code: `# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]`,
      output: `Builds a lightweight, isolated, production-ready Node.js environment`,
      executionSteps: [
        { line: 2, explanation: 'Starts with a minimal Linux OS (Alpine) pre-installed with Node 18' },
        { line: 9, explanation: 'Installs dependencies inside the isolated container environment' },
        { line: 18, explanation: 'The final command executed when the container starts running' }
      ]
    },
    keyPoints: [
      'Containers are NOT Virtual Machines (VMs). VMs virtualize the hardware and run a full, heavy Guest OS. Containers virtualize the OS and share the Host OS kernel, making them incredibly lightweight and fast.'
    ],
    tags: ['DevOps', 'Docker', 'Containers', 'Infrastructure']
  },
  {
    id: 'devops-3',
    stack: 'devops',
    topic: 'Cloud Architecture',
    title: 'What is Kubernetes (K8s)? Why do we need it if we already have Docker?',
    difficulty: 'Advanced',
    summary: 'Docker is great for creating and running a single container. Kubernetes is an orchestration system that manages thousands of containers across multiple servers.',
    explanation: [
      'The Problem: You have 50 Docker containers running your microservices. A server crashes and 10 containers die. How do you detect this? How do you automatically restart them on a different server? How do you route traffic between them?',
      'The Solution (Kubernetes): K8s is the "conductor of the orchestra". You tell K8s your desired state (e.g., "I always want 3 instances of my Node.js API running"). If one crashes, K8s instantly spawns a replacement on a healthy node.',
      'Key Concepts:',
      '- Pod: The smallest deployable unit in K8s (usually contains one container).',
      '- Deployment: Manages scaling and updates for a set of Pods.',
      '- Service: Provides a stable IP address and load balancing to route traffic to the Pods.'
    ],
    keyPoints: [
      'Docker runs containers. Kubernetes orchestrates containers.',
      'K8s provides self-healing, automated rollouts/rollbacks, and horizontal scaling.'
    ],
    interviewTip: 'Mentioning that Kubernetes was originally developed by Google (Borg) to run their massive infrastructure shows deep historical industry knowledge.',
    tags: ['DevOps', 'Kubernetes', 'K8s', 'Orchestration', 'Advanced']
  },
  {
    id: 'devops-4',
    stack: 'devops',
    topic: 'Deployment Strategies',
    title: 'Explain Blue/Green Deployments and Canary Releases.',
    difficulty: 'Advanced',
    summary: 'These are advanced deployment strategies designed to eliminate downtime and reduce the risk of introducing critical bugs to production users.',
    explanation: [
      'Blue/Green Deployment: You have two identical production environments. Blue is currently live. You deploy the new version V2 to Green. You run tests on Green. If successful, you flip the load balancer router to instantly point all traffic to Green. If something breaks, you instantly flip back to Blue. (Zero downtime, instant rollback).',
      'Canary Release: You deploy the new version V2, but only route 5% of user traffic to it. You monitor logs for errors. If it is stable, you gradually increase traffic to 25%, 50%, and 100%. (Named after the "canary in the coal mine" used to detect toxic gas).'
    ],
    keyPoints: [
      'Blue/Green requires double the server infrastructure but offers the safest, fastest rollback.',
      'Canary limits the blast radius of a bug to a small percentage of users.'
    ],
    tags: ['DevOps', 'Deployment', 'Blue/Green', 'Canary', 'Architecture']
  }
];
