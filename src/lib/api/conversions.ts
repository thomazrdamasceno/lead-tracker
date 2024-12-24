import { supabase } from '../supabase/client';
import type { Conversion } from '../../types';

export async function createConversion(data: Omit<Conversion, 'id' | 'created_at'>) {
  const { data: conversion, error } = await supabase
    .from('conversions')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Create conversion error:', error);
    throw new Error('Failed to create conversion');
  }

  return conversion;
}

export async function updateConversion(
  id: string,
  data: Omit<Conversion, 'id' | 'created_at'>
) {
  const { data: conversion, error } = await supabase
    .from('conversions')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update conversion error:', error);
    throw new Error('Failed to update conversion');
  }

  return conversion;
}