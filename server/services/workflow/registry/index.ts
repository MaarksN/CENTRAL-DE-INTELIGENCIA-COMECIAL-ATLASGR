import { ActionRegistry } from './ActionRegistry.js';
import { ConditionRegistry } from './ConditionRegistry.js';
import { TriggerRegistry } from './TriggerRegistry.js';
import { TriggerEngine } from '../engine/TriggerEngine.js';

import { CreateActivityAction } from '../actions/CreateActivityAction.js';
import { ScoreGreaterThanCondition } from '../conditions/ScoreGreaterThanCondition.js';
import { LeadCreatedTrigger } from '../triggers/LeadCreatedTrigger.js';

export function initializeWorkflowEngine() {
  ActionRegistry.register(new CreateActivityAction());
  ConditionRegistry.register(new ScoreGreaterThanCondition());
  TriggerRegistry.register(new LeadCreatedTrigger());
  
  TriggerEngine.initialize();
  
  console.log('[WorkflowRegistry] Registered all plugins and initialized engine.');
}
