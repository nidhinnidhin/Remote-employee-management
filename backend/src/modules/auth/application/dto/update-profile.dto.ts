import {
  IsOptional,
  IsString,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
  IsIn,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

const TrimOptional = () =>
  Transform(({ value }) => {
    if (value === '' || value === null) return null;
    if (value === undefined) return undefined;
    return typeof value === 'string' ? value.trim() : value;
  });

export class UpdateProfileDto {
  @IsOptional()
  @TrimOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: 'First name must only contain letters, spaces, or hyphens',
  })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(20, { message: 'First name must not exceed 20 characters' })
  firstName?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: 'Last name must only contain letters, spaces, or hyphens',
  })
  @MinLength(1, { message: 'Last name must be at least 1 character' })
  @MaxLength(20, { message: 'Last name must not exceed 20 characters' })
  lastName?: string | null;

  @IsOptional()
  @TrimOptional()
  @Matches(/^\d{10}$/, {
    message: 'Emergency contact phone must be exactly 10 digits',
  })
  phone?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsDateString({}, { message: 'Invalid date format (YYYY-MM-DD)' })
  dateOfBirth?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsIn(['Male', 'Female', 'Non-binary', 'Prefer not to say'], {
    message: 'Invalid gender value',
  })
  gender?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsIn(['Single', 'Married', 'Divorced', 'Widowed', 'Prefer not to say'], {
    message: 'Invalid marital status',
  })
  maritalStatus?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: 'Nationality must only contain letters, spaces, or hyphens',
  })
  @MaxLength(50, { message: 'Nationality must not exceed 50 characters' })
  nationality?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Invalid blood group',
  })
  bloodGroup?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @MaxLength(50, { message: 'Timezone must not exceed 50 characters' })
  timeZone?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @MaxLength(300, { message: 'Bio cannot exceed 300 characters' })
  bio?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @MaxLength(100, { message: 'Street address too long' })
  streetAddress?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: 'City must only contain letters, spaces, or hyphens',
  })
  @MaxLength(50, { message: 'City must not exceed 50 characters' })
  city?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: 'State must only contain letters, spaces, or hyphens',
  })
  @MaxLength(50, { message: 'State must not exceed 50 characters' })
  state?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message: 'Country must only contain letters, spaces, or hyphens',
  })
  @MaxLength(50, { message: 'Country must not exceed 50 characters' })
  country?: string | null;

  @IsOptional()
  @TrimOptional()
  @Matches(/^[a-zA-Z0-9\s-]{3,10}$/, {
    message: 'Invalid ZIP/Postal code',
  })
  zipCode?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s-]+$/, {
    message:
      'Emergency contact name must only contain letters, spaces, or hyphens',
  })
  @MaxLength(50, { message: 'Emergency contact name too long' })
  emergencyContactName?: string | null;

  @IsOptional()
  @TrimOptional()
  @Matches(/^\d{10}$/, {
    message: 'Emergency contact phone must be exactly 10 digits',
  })
  emergencyContactPhone?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsIn(['Spouse', 'Parent', 'Sibling', 'Friend', 'Child', 'Other'], {
    message: 'Invalid relationship',
  })
  emergencyContactRelation?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  linkedInUrl?: string | null;

  @IsOptional()
  @TrimOptional()
  @IsString()
  personalWebsite?: string | null;
}
