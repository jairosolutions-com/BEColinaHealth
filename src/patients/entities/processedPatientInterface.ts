// processed-patient.interface.ts

export interface ProcessedPatient {
    id: number;
    uuid: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    codeStatus: string;
    allergies: string; // Changed to string type
  }
  export interface fullPatientInfo {
    id: number;
    uuid: string;
    firstName: string;
    lastName: string;
    age?: number; // Make age optional since it's nullable
    dateOfBirth?: Date; // Make dateOfBirth optional since it's nullable
    medicalCondition?: string; // Make medicalCondition optional since it's nullable
    gender: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phoneNo: string;
    admissionDate?: Date; // Make admissionDate optional since it's nullable
    codeStatus: string;
    allergies: string; // Changed to string type for joined allergies
  }
  
  