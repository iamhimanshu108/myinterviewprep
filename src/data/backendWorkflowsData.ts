import { BackendWorkflowTopic } from '../types';
import { WorkflowTopicData } from '../types';

import { mvcWorkflow } from './workflows/mvc';
import { crudWorkflow } from './workflows/crud';
import { authWorkflow } from './workflows/auth';
import { restWorkflow } from './workflows/rest';
import { middlewareWorkflow } from './workflows/middleware';
import { reactWorkflow } from './workflows/react';
import { reactNativeWorkflow } from './workflows/react-native';
import { devopsWorkflow } from './workflows/devops';
import { networkingWorkflow } from './workflows/networking';
import { osMemoryWorkflow } from './workflows/os-memory';
import { cliToolsWorkflow } from './workflows/cli-tools';
import { dataStructuresWorkflow } from './workflows/data-structures';
import { graphqlWorkflow } from './workflows/graphql';
import { grpcWorkflow } from './workflows/grpc';
import { websocketsWorkflow } from './workflows/websockets';
import { sqlDbsWorkflow } from './workflows/sql-dbs';
import { nosqlDbsWorkflow } from './workflows/nosql-dbs';
import { cachingWorkflow } from './workflows/caching';
import { ormsWorkflow } from './workflows/orms';
import { owaspWorkflow } from './workflows/owasp';
import { encryptionWorkflow } from './workflows/encryption';
import { loadBalancersWorkflow } from './workflows/load-balancers';
import { messageQueuesWorkflow } from './workflows/message-queues';
import { microservicesWorkflow } from './workflows/microservices';
import { dockerWorkflow } from './workflows/docker';
import { cicdWorkflow } from './workflows/cicd';
import { monitoringWorkflow } from './workflows/monitoring';

export const BACKEND_WORKFLOWS: Record<BackendWorkflowTopic, WorkflowTopicData> = {
  mvc: mvcWorkflow,
  crud: crudWorkflow,
  auth: authWorkflow,
  rest: restWorkflow,
  middleware: middlewareWorkflow,
  react: reactWorkflow,
  'react-native': reactNativeWorkflow,
  devops: devopsWorkflow,
  networking: networkingWorkflow,
  'os-memory': osMemoryWorkflow,
  'cli-tools': cliToolsWorkflow,
  'data-structures': dataStructuresWorkflow,
  graphql: graphqlWorkflow,
  grpc: grpcWorkflow,
  websockets: websocketsWorkflow,
  'sql-dbs': sqlDbsWorkflow,
  'nosql-dbs': nosqlDbsWorkflow,
  caching: cachingWorkflow,
  orms: ormsWorkflow,
  owasp: owaspWorkflow,
  encryption: encryptionWorkflow,
  'load-balancers': loadBalancersWorkflow,
  'message-queues': messageQueuesWorkflow,
  microservices: microservicesWorkflow,
  docker: dockerWorkflow,
  cicd: cicdWorkflow,
  monitoring: monitoringWorkflow,
};
