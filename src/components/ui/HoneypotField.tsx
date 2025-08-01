'use client';

import { generateHoneypotFieldName } from '@/lib/security/honeypot';
import { useState, useEffect } from 'react';

interface HoneypotFieldProps {
  onChange: (value: string) => void;
}

export default function HoneypotField({ onChange }: HoneypotFieldProps) {
  const [fieldName, setFieldName] = useState('');

  useEffect(() => {
    setFieldName(generateHoneypotFieldName());
  }, []);

  return (
    <input
      type="text"
      name={fieldName}
      autoComplete="off"
      tabIndex={-1}
      onChange={(e) => onChange(e.target.value)}
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        visibility: 'hidden'
      }}
      aria-hidden="true"
    />
  );
}