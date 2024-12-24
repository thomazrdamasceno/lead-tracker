import { supabase } from '../supabase/client';

export async function duplicateWebsite(websiteId: string) {
  // Get original website data
  const { data: website, error: websiteError } = await supabase
    .from('websites')
    .select('*')
    .eq('id', websiteId)
    .single();

  if (websiteError) throw websiteError;

  // Create new website with copied data
  const { data: newWebsite, error: createError } = await supabase
    .from('websites')
    .insert({
      user_id: website.user_id,
      name: `${website.name} (Copy)`,
      domain: website.domain,
      pixel_id: website.pixel_id,
      pixel_token: website.pixel_token
    })
    .select()
    .single();

  if (createError) throw createError;
  return newWebsite;
}

export async function duplicateConversion(conversionId: string) {
  // Get original conversion data
  const { data: conversion, error: conversionError } = await supabase
    .from('conversions')
    .select('*')
    .eq('id', conversionId)
    .single();

  if (conversionError) throw conversionError;

  // Create new conversion with copied data
  const { data: newConversion, error: createError } = await supabase
    .from('conversions')
    .insert({
      website_id: conversion.website_id,
      title: `${conversion.title} (Copy)`,
      trigger_type: conversion.trigger_type,
      event_type: conversion.event_type,
      configuration: conversion.configuration
    })
    .select()
    .single();

  if (createError) throw createError;
  return newConversion;
}