import { createWebsite, updateWebsite } from './websites';
import { createConversion, updateConversion } from './conversions';
import { duplicateWebsite, duplicateConversion } from './duplicate';
import { createEvent } from './events';
import { createOrUpdateLead } from './leads';

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