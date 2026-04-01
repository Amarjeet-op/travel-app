export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhone(phone: string): boolean {
  const re = /^\+?[\d\s-]{10,15}$/;
  return re.test(phone);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function validateOnboardingForm(data: {
  displayName: string;
  gender: string;
  age: string;
  phone: string;
  homeCity: string;
  bio: string;
  emergencyContacts: { name: string; phone: string; relationship: string }[];
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.displayName.trim()) errors.displayName = 'Name is required';
  if (!data.gender) errors.gender = 'Gender is required';
  if (!data.age || parseInt(data.age) < 18) errors.age = 'Must be at least 18';
  if (!isValidPhone(data.phone)) errors.phone = 'Valid phone number required';
  if (!data.homeCity) errors.homeCity = 'Home city is required';
  if (data.bio.length > 300) errors.bio = 'Bio must be under 300 characters';
  if (data.emergencyContacts.length === 0)
    errors.emergencyContacts = 'At least one emergency contact required';

  data.emergencyContacts.forEach((contact, i) => {
    if (!contact.name.trim()) errors[`contact_${i}_name`] = 'Name required';
    if (!isValidPhone(contact.phone)) errors[`contact_${i}_phone`] = 'Valid phone required';
    if (!contact.relationship.trim()) errors[`contact_${i}_relationship`] = 'Relationship required';
  });

  return errors;
}

export function validateTripForm(data: {
  fromCity: string;
  toCity: string;
  departureDate: Date | null;
  maxCompanions: number;
  description: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.fromCity) errors.fromCity = 'Origin city required';
  if (!data.toCity) errors.toCity = 'Destination city required';
  if (data.fromCity === data.toCity) errors.toCity = 'Must be different from origin';
  if (!data.departureDate) errors.departureDate = 'Departure date required';
  if (data.departureDate && data.departureDate < new Date())
    errors.departureDate = 'Must be in the future';
  if (data.maxCompanions < 1 || data.maxCompanions > 5)
    errors.maxCompanions = 'Must be 1-5';
  if (data.description.length > 500)
    errors.description = 'Description must be under 500 characters';

  return errors;
}
