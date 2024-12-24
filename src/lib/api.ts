import { createWebsite, updateWebsite } from './api/websites';
import { createConversion, updateConversion } from './api/conversions';
import { duplicateWebsite, duplicateConversion } from './api/duplicate';
import { createEvent } from './api/events';
import { createOrUpdateLead } from './api/leads';

export {
  // Websites
  createWebsite,
  updateWebsite,
  duplicateWebsite,
  
  // Conversions
  createConversion,
  updateConversion,
  duplicateConversion,
  
  // Events
  createEvent,
  
  // Leads
  createOrUpdateLead
};