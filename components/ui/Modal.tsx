/**
 * Modal 组件
 * 带焦点管理和可访问性支持的模态框
 */

'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = 'lg',
  closeOnOutsideClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // 焦点陷阱：在模态框打开时管理焦点
  useEffect(() => {
    if (!isOpen) return;

    // 保存当前焦点元素
    previousActiveElement.current = document.activeElement;

    // 获取模态框内所有可聚焦元素
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // 聚焦到第一个可聚焦元素
    const focusableElements = modalElement.querySelectorAll<
      HTMLElement | SVGElement
    >(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // 禁用背景滚动
    document.body.style.overflow = 'hidden';

    return () => {
      // 恢复焦点到触发元素
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }

      // 恢复背景滚动
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC 键关闭
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Tab 键循环焦点
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalElement.querySelectorAll<
        HTMLElement | SVGElement
      >(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // 如果按 Shift+Tab 且在第一个元素，跳到最后一个
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        (lastElement as HTMLElement).focus();
      }
      // 如果按 Tab 且在最后一个元素，跳到第一个
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        (firstElement as HTMLElement).focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={closeOnOutsideClick ? onClose : undefined}
      />

      {/* 模态框内容 */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white rounded-2xl shadow-xl w-full max-h-[85vh] overflow-hidden flex flex-col',
          maxWidthClass,
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                {icon}
              </div>
            )}
            <h2
              id="modal-title"
              className="text-xl font-bold text-gray-900"
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="关闭对话框"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 内容区 */}
        <div
          id="modal-content"
          className="flex-1 overflow-y-auto p-6"
        >
          {children}
        </div>

        {/* 底部 */}
        {footer && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 无障碍说明：
 *
 * 1. ARIA 属性：
 *    - role="dialog": 标识为对话框
 *    - aria-modal="true": 表示模态对话框
 *    - aria-labelledby: 关联标题
 *    - aria-describedby: 关联内容描述
 *    - aria-label: 按钮标签（关闭按钮）
 *
 * 2. 焦点管理：
 *    - 打开时自动聚焦到第一个可聚焦元素
 *    - 关闭时恢复焦点到触发元素
 *    - Tab 键在模态框内循环
 *    - 禁用背景滚动
 *
 * 3. 键盘支持：
 *    - ESC 键关闭模态框
 *    - Tab 键循环焦点
 *    - Shift+Tab 反向循环
 *
 * 4. 屏幕阅读器：
 *    - 使用语义化 HTML
 *    - 正确的 ARIA 标签
 *    - aria-hidden 隐藏装饰元素
 */
