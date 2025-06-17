import bcrypt from "bcrypt";

// uses bcrypt hashing algorithm
// bcrypt operations are asyncronous
// hashValue is an encrypted string

export const hashValue = async (value: string, saltRounds?: number) =>
    bcrypt.hash(value, saltRounds || 10);

export const compareValue = async (value: string, hashedValue: string) =>
    bcrypt.compare(value, hashedValue).catch(() => false);