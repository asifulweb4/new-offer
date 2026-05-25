export type AccountTier = 'personal' | 'business' | 'sub_admin';

export interface User {
  name: string;
  phone: string;
  tier: AccountTier;
  balance: number;
  password?: string;
}

export type OperatorType = 'gp' | 'banglalink' | 'robi' | 'airtel' | 'teletalk';

export interface Offer {
  id: string;
  operator: OperatorType;
  title: string;
  validity: string;
  price: number;
  originalPrice: number;
  category: 'data' | 'voice' | 'combo';
}

export interface Transaction {
  id: string;
  type: 'add_money' | 'withdraw' | 'buy_offer' | 'upgrade_tier';
  amount: number;
  details: string;
  status: 'pending' | 'success' | 'failed';
  date: string;
  number?: string;
  txId?: string;
  gateway?: string;
}
