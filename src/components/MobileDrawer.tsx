'use client';

import { useRef, useCallback, type ReactNode } from 'react';

export type DrawerPosition = 'closed' | 'half' | 'full';

interface MobileDrawerProps {
  position: DrawerPosition;
  onPositionChange: (position: DrawerPosition) => void;
  children: ReactNode;
}

const TRANSLATE: Record<DrawerPosition, string> = {
  closed: 'translateY(100%)',
  half: 'translateY(50%)',
  full: 'translateY(15%)',
};

export default function MobileDrawer({
  position,
  onPositionChange,
  children,
}: MobileDrawerProps) {
  const dragStartY = useRef<number | null>(null);
  const dragCurrentY = useRef<number>(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getTranslatePercent = useCallback((): number => {
    if (position === 'closed') return 100;
    if (position === 'half') return 50;
    return 15;
  }, [position]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragCurrentY.current = 0;
    isDragging.current = false;
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (dragStartY.current === null || !drawerRef.current) return;
      const delta = e.touches[0].clientY - dragStartY.current;
      dragCurrentY.current = delta;

      if (Math.abs(delta) > 5) {
        isDragging.current = true;
      }

      const basePercent = getTranslatePercent();
      const vh = window.innerHeight;
      const deltaPercent = (delta / vh) * 100;
      const newPercent = Math.max(15, Math.min(100, basePercent + deltaPercent));
      drawerRef.current.style.transition = 'none';
      drawerRef.current.style.transform = `translateY(${newPercent}%)`;
    },
    [getTranslatePercent],
  );

  const onTouchEnd = useCallback(() => {
    if (!drawerRef.current) return;
    drawerRef.current.style.transition = '';

    if (!isDragging.current) {
      dragStartY.current = null;
      return;
    }

    const vh = window.innerHeight;
    const deltaPercent = (dragCurrentY.current / vh) * 100;
    const currentPercent = getTranslatePercent() + deltaPercent;

    let snapTo: DrawerPosition;
    if (currentPercent > 75) {
      snapTo = 'closed';
    } else if (currentPercent > 32) {
      snapTo = 'half';
    } else {
      snapTo = 'full';
    }

    drawerRef.current.style.transform = TRANSLATE[snapTo];
    onPositionChange(snapTo);
    dragStartY.current = null;
    isDragging.current = false;
  }, [getTranslatePercent, onPositionChange]);

  const handleDragHandleTap = () => {
    if (isDragging.current) return;
    onPositionChange(position === 'closed' ? 'half' : 'closed');
  };

  return (
    <>
      {/* Backdrop */}
      {position !== 'closed' && (
        <div
          className="fixed inset-0 z-[900] bg-black/40 md:hidden"
          onClick={() => onPositionChange('closed')}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-x-0 bottom-14 top-0 z-[950] flex flex-col rounded-t-2xl bg-gray-950 shadow-2xl transition-transform duration-300 ease-out md:hidden"
        style={{ transform: TRANSLATE[position] }}
      >
        {/* Drag handle */}
        <div
          className="flex cursor-grab items-center justify-center py-3"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={handleDragHandleTap}
        >
          <div className="h-1 w-10 rounded-full bg-gray-600" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </>
  );
}
