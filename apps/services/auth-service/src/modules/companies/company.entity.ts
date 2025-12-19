import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  addressStreet: string;

  @Column({ nullable: true })
  addressCity: string;

  @Column({ nullable: true })
  addressState: string;

  @Column({ nullable: true })
  addressZip: string;

  @Column({ nullable: true })
  addressCountry: string;

  @Column({ nullable: true })
  timeZone: string;

  @Column({ nullable: true })
  logoUrl: string;

  // 🔹 Subscription snapshot (read-only)
  @Column()
  subscriptionPlanId: string;

  @Column()
  subscriptionStatus: string;

  @Column()
  billingCycle: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
