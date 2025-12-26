'use client';

import { useState, useEffect } from 'react';

interface ToolUsage {
  count: number;
  lastUsed: number;
  hasSignedUp: boolean;
}

const STORAGE_PREFIX = 'tool_usage_';
const FREE_TIER_LIMIT = 1; // After this many uses, show email capture

/**
 * Hook to track tool usage and determine when to show email capture modal
 * Uses localStorage for anonymous tracking before signup
 */
export function useToolUsage(toolId: string) {
  const [usageCount, setUsageCount] = useState(0);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);

  useEffect(() => {
    // Load usage data from localStorage
    const stored = localStorage.getItem(STORAGE_PREFIX + toolId);
    if (stored) {
      try {
        const data: ToolUsage = JSON.parse(stored);
        setUsageCount(data.count);
        setHasSignedUp(data.hasSignedUp);
      } catch (error) {
        console.error('Failed to parse tool usage data:', error);
      }
    }
  }, [toolId]);

  /**
   * Track a tool use and determine if modal should show
   */
  const trackUsage = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);

    // Save to localStorage
    const usage: ToolUsage = {
      count: newCount,
      lastUsed: Date.now(),
      hasSignedUp,
    };
    localStorage.setItem(STORAGE_PREFIX + toolId, JSON.stringify(usage));

    // Show modal if exceeded free tier and haven't signed up
    if (newCount > FREE_TIER_LIMIT && !hasSignedUp) {
      setShouldShowModal(true);
    }
  };

  /**
   * Mark user as signed up (no more modals)
   */
  const markSignedUp = () => {
    setHasSignedUp(true);
    setShouldShowModal(false);

    const usage: ToolUsage = {
      count: usageCount,
      lastUsed: Date.now(),
      hasSignedUp: true,
    };
    localStorage.setItem(STORAGE_PREFIX + toolId, JSON.stringify(usage));
  };

  /**
   * Close modal without signing up (they can still use tool but modal will show again next time)
   */
  const closeModal = () => {
    setShouldShowModal(false);
  };

  return {
    usageCount,
    shouldShowModal,
    hasSignedUp,
    trackUsage,
    markSignedUp,
    closeModal,
    isFreeTier: usageCount <= FREE_TIER_LIMIT,
  };
}
