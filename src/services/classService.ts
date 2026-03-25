import { db } from '../config/firebase';
import { generateCode } from '../utils/generateCode';

export const createClass = async (
  name: string,
  teacherId: string,
  organizationId: string
) => {
  const accessCode = generateCode(6);

  const classRef = await db.collection('classes').add({
    name,
    teacherId,
    organizationId,
    accessCode,
    createdAt: new Date(),
  });

  return {
    id: classRef.id,
    accessCode,
  };
};