import { Button } from '@/components/ui/button';
import React from 'react';

interface PreviewStepProps {
  data: any;
  onEdit: (step: number) => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ data, onEdit }) => {
  return (
    <div>
      <h3>Review Your Data</h3>
      <div>
        <p><strong>First Name:</strong> {data.membershipCategory}</p>
        <p><strong>Last Name:</strong> {data.membershipType}</p>
        <p><strong>Email:</strong> {data.name}</p>
        <p><strong>Phone:</strong> {data.dob}</p>
        <p><strong>Documents:</strong> {data.idCard[0].name} files uploaded</p>
      </div>
      <Button type="button" onClick={() => onEdit(0)}>Edit </Button>
    </div>
  );
};

export default PreviewStep;
