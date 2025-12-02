/**
 * usePages Hook
 * Hook for managing pages API operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import * as pagesAPI from '../api/pages';
import type { CreatePageInput, UpdatePageInput } from '../validation/schemas';

export function usePages(options?: { projectId?: string; published?: boolean; limit?: number; offset?: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    pagesAPI.getPages(options)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(options)]);

  return { data, loading, error };
}

export function usePage(slug: string | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    pagesAPI.getPage(slug)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { data, loading, error };
}

export function useCreatePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: CreatePageInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pagesAPI.createPage(data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, []);

  return { mutate, loading, error };
}

export function useUpdatePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (slug: string, data: UpdatePageInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pagesAPI.updatePage(slug, data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, []);

  return { mutate, loading, error };
}

export function useDeletePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pagesAPI.deletePage(slug);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, []);

  return { mutate, loading, error };
}

export function usePublishPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (slug: string, published: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pagesAPI.publishPage(slug, published);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, []);

  return { mutate, loading, error };
}

