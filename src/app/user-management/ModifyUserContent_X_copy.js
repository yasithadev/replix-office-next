import React, { useState, useCallback, useMemo } from 'react';
import {
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  X,
  UserPlus,
  Activity,
  Sun,
  Moon,
  Trash2
} from 'lucide-react';
import DataTable from '../../components/table/datatable';

export const pageMeta = {
  title: 'Modify User',
  breadcrumb: ['Dashboard', 'User Management', 'Modify User'],
};

const INITIAL_DATA = [
  { id: 'USR-1001', name: 'Alexander Wright', email: 'alexander.w@enterprise.io', role: 'Engineering Lead', department: 'Engineering', status: 'Active', salary: 145000, joinDate: '2021-03-15', performance: 94, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1002', name: 'Sophia Chen', email: 'sophia.c@enterprise.io', role: 'Senior Designer', department: 'Design', status: 'Active', salary: 118000, joinDate: '2022-01-10', performance: 88, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1003', name: 'Marcus Vance', email: 'marcus.v@enterprise.io', role: 'Product Manager', department: 'Product', status: 'Pending', salary: 132000, joinDate: '2023-06-01', performance: 79, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1004', name: 'Elena Rostova', email: 'elena.r@enterprise.io', role: 'Data Analyst', department: 'Analytics', status: 'Active', salary: 105000, joinDate: '2022-09-20', performance: 91, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1005', name: 'David Kim', email: 'david.k@enterprise.io', role: 'DevOps Architect', department: 'Engineering', status: 'Active', salary: 150000, joinDate: '2020-11-05', performance: 96, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1006', name: 'Jessica Miller', email: 'jessica.m@enterprise.io', role: 'Marketing Director', department: 'Marketing', status: 'Inactive', salary: 125000, joinDate: '2019-04-12', performance: 65, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1007', name: 'Liam O\'Connor', email: 'liam.o@enterprise.io', role: 'Backend Engineer', department: 'Engineering', status: 'Active', salary: 112000, joinDate: '2023-02-14', performance: 85, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1008', name: 'Amara Patel', email: 'amara.p@enterprise.io', role: 'UX Researcher', department: 'Design', status: 'Active', salary: 98000, joinDate: '2023-08-19', performance: 90, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1009', name: 'Lucas Sterling', email: 'lucas.s@enterprise.io', role: 'Account Executive', department: 'Sales', status: 'Suspended', salary: 92000, joinDate: '2021-08-01', performance: 42, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1010', name: 'Zoe Thorne', email: 'zoe.t@enterprise.io', role: 'QA Lead', department: 'Engineering', status: 'Pending', salary: 108000, joinDate: '2023-11-01', performance: 83, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1011', name: 'Gabriel Torres', email: 'gabriel.t@enterprise.io', role: 'Security Analyst', department: 'Engineering', status: 'Active', salary: 135000, joinDate: '2021-12-03', performance: 92, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1012', name: 'Chloe Dubois', email: 'chloe.d@enterprise.io', role: 'Content Strategist', department: 'Marketing', status: 'Active', salary: 89000, joinDate: '2022-05-18', performance: 87, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1013', name: 'Ethan Harper', email: 'ethan.h@enterprise.io', role: 'Sales Manager', department: 'Sales', status: 'Active', salary: 140000, joinDate: '2020-02-28', performance: 95, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1014', name: 'Maya Lin', email: 'maya.l@enterprise.io', role: 'Frontend Engineer', department: 'Engineering', status: 'Pending', salary: 115000, joinDate: '2024-01-15', performance: 81, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1015', name: 'Carlos Mendez', email: 'carlos.m@enterprise.io', role: 'HR Business Partner', department: 'Human Resources', status: 'Active', salary: 95000, joinDate: '2021-07-22', performance: 89, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1016', name: 'Nadia Osei', email: 'nadia.o@enterprise.io', role: 'Finance Manager', department: 'Finance', status: 'Active', salary: 128000, joinDate: '2020-06-09', performance: 93, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1017', name: 'Ravi Subramaniam', email: 'ravi.s@enterprise.io', role: 'Cloud Engineer', department: 'Engineering', status: 'Active', salary: 138000, joinDate: '2022-03-11', performance: 90, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1018', name: 'Isabella Rossi', email: 'isabella.r@enterprise.io', role: 'Brand Manager', department: 'Marketing', status: 'Pending', salary: 102000, joinDate: '2023-09-25', performance: 77, avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1019', name: 'Noah Bennett', email: 'noah.b@enterprise.io', role: 'Support Engineer', department: 'Engineering', status: 'Active', salary: 97000, joinDate: '2023-04-03', performance: 84, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1020', name: 'Priya Nair', email: 'priya.n@enterprise.io', role: 'Talent Acquisition Lead', department: 'Human Resources', status: 'Active', salary: 99000, joinDate: '2022-10-14', performance: 86, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1021', name: 'Alexander Wright', email: 'alexander.w@enterprise.io', role: 'Engineering Lead', department: 'Engineering', status: 'Pending', salary: 146500, joinDate: '2021-03-15', performance: 92, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1022', name: 'Sophia Chen', email: 'sophia.c@enterprise.io', role: 'Senior Designer', department: 'Design', status: 'Inactive', salary: 119500, joinDate: '2022-01-10', performance: 86, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1023', name: 'Marcus Vance', email: 'marcus.v@enterprise.io', role: 'Product Manager', department: 'Product', status: 'Suspended', salary: 133500, joinDate: '2023-06-01', performance: 77, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1024', name: 'Elena Rostova', email: 'elena.r@enterprise.io', role: 'Data Analyst', department: 'Analytics', status: 'Active', salary: 106500, joinDate: '2022-09-20', performance: 89, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1025', name: 'David Kim', email: 'david.k@enterprise.io', role: 'DevOps Architect', department: 'Engineering', status: 'Pending', salary: 151500, joinDate: '2020-11-05', performance: 94, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1026', name: 'Jessica Miller', email: 'jessica.m@enterprise.io', role: 'Marketing Director', department: 'Marketing', status: 'Inactive', salary: 126500, joinDate: '2019-04-12', performance: 63, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1027', name: 'Liam O\'Connor', email: 'liam.o@enterprise.io', role: 'Backend Engineer', department: 'Engineering', status: 'Suspended', salary: 113500, joinDate: '2023-02-14', performance: 83, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1028', name: 'Amara Patel', email: 'amara.p@enterprise.io', role: 'UX Researcher', department: 'Design', status: 'Active', salary: 99500, joinDate: '2023-08-19', performance: 88, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1029', name: 'Lucas Sterling', email: 'lucas.s@enterprise.io', role: 'Account Executive', department: 'Sales', status: 'Pending', salary: 93500, joinDate: '2021-08-01', performance: 40, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1030', name: 'Zoe Thorne', email: 'zoe.t@enterprise.io', role: 'QA Lead', department: 'Engineering', status: 'Inactive', salary: 109500, joinDate: '2023-11-01', performance: 81, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1031', name: 'Gabriel Torres', email: 'gabriel.t@enterprise.io', role: 'Security Analyst', department: 'Engineering', status: 'Suspended', salary: 136500, joinDate: '2021-12-03', performance: 90, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1032', name: 'Chloe Dubois', email: 'chloe.d@enterprise.io', role: 'Content Strategist', department: 'Marketing', status: 'Active', salary: 90500, joinDate: '2022-05-18', performance: 85, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1033', name: 'Ethan Harper', email: 'ethan.h@enterprise.io', role: 'Sales Manager', department: 'Sales', status: 'Pending', salary: 141500, joinDate: '2020-02-28', performance: 93, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1034', name: 'Maya Lin', email: 'maya.l@enterprise.io', role: 'Frontend Engineer', department: 'Engineering', status: 'Inactive', salary: 116500, joinDate: '2024-01-15', performance: 79, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1035', name: 'Carlos Mendez', email: 'carlos.m@enterprise.io', role: 'HR Business Partner', department: 'Human Resources', status: 'Suspended', salary: 96500, joinDate: '2021-07-22', performance: 87, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1036', name: 'Nadia Osei', email: 'nadia.o@enterprise.io', role: 'Finance Manager', department: 'Finance', status: 'Active', salary: 129500, joinDate: '2020-06-09', performance: 91, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1037', name: 'Ravi Subramaniam', email: 'ravi.s@enterprise.io', role: 'Cloud Engineer', department: 'Engineering', status: 'Pending', salary: 139500, joinDate: '2022-03-11', performance: 88, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1038', name: 'Isabella Rossi', email: 'isabella.r@enterprise.io', role: 'Brand Manager', department: 'Marketing', status: 'Inactive', salary: 103500, joinDate: '2023-09-25', performance: 75, avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1039', name: 'Noah Bennett', email: 'noah.b@enterprise.io', role: 'Support Engineer', department: 'Engineering', status: 'Suspended', salary: 98500, joinDate: '2023-04-03', performance: 82, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1040', name: 'Priya Nair', email: 'priya.n@enterprise.io', role: 'Talent Acquisition Lead', department: 'Human Resources', status: 'Active', salary: 100500, joinDate: '2022-10-14', performance: 84, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1041', name: 'Alexander Wright', email: 'alexander.w@enterprise.io', role: 'Engineering Lead', department: 'Engineering', status: 'Inactive', salary: 148000, joinDate: '2021-03-15', performance: 90, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1042', name: 'Sophia Chen', email: 'sophia.c@enterprise.io', role: 'Senior Designer', department: 'Design', status: 'Suspended', salary: 121000, joinDate: '2022-01-10', performance: 84, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1043', name: 'Marcus Vance', email: 'marcus.v@enterprise.io', role: 'Product Manager', department: 'Product', status: 'Active', salary: 135000, joinDate: '2023-06-01', performance: 75, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1044', name: 'Elena Rostova', email: 'elena.r@enterprise.io', role: 'Data Analyst', department: 'Analytics', status: 'Pending', salary: 108000, joinDate: '2022-09-20', performance: 87, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1045', name: 'David Kim', email: 'david.k@enterprise.io', role: 'DevOps Architect', department: 'Engineering', status: 'Inactive', salary: 153000, joinDate: '2020-11-05', performance: 92, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1046', name: 'Jessica Miller', email: 'jessica.m@enterprise.io', role: 'Marketing Director', department: 'Marketing', status: 'Suspended', salary: 128000, joinDate: '2019-04-12', performance: 61, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1047', name: 'Liam O\'Connor', email: 'liam.o@enterprise.io', role: 'Backend Engineer', department: 'Engineering', status: 'Active', salary: 115000, joinDate: '2023-02-14', performance: 81, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1048', name: 'Amara Patel', email: 'amara.p@enterprise.io', role: 'UX Researcher', department: 'Design', status: 'Pending', salary: 101000, joinDate: '2023-08-19', performance: 86, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1049', name: 'Lucas Sterling', email: 'lucas.s@enterprise.io', role: 'Account Executive', department: 'Sales', status: 'Inactive', salary: 95000, joinDate: '2021-08-01', performance: 38, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1050', name: 'Zoe Thorne', email: 'zoe.t@enterprise.io', role: 'QA Lead', department: 'Engineering', status: 'Suspended', salary: 111000, joinDate: '2023-11-01', performance: 79, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1051', name: 'Gabriel Torres', email: 'gabriel.t@enterprise.io', role: 'Security Analyst', department: 'Engineering', status: 'Active', salary: 138000, joinDate: '2021-12-03', performance: 88, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1052', name: 'Chloe Dubois', email: 'chloe.d@enterprise.io', role: 'Content Strategist', department: 'Marketing', status: 'Pending', salary: 92000, joinDate: '2022-05-18', performance: 83, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1053', name: 'Ethan Harper', email: 'ethan.h@enterprise.io', role: 'Sales Manager', department: 'Sales', status: 'Inactive', salary: 143000, joinDate: '2020-02-28', performance: 91, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1054', name: 'Maya Lin', email: 'maya.l@enterprise.io', role: 'Frontend Engineer', department: 'Engineering', status: 'Suspended', salary: 118000, joinDate: '2024-01-15', performance: 77, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1055', name: 'Carlos Mendez', email: 'carlos.m@enterprise.io', role: 'HR Business Partner', department: 'Human Resources', status: 'Active', salary: 98000, joinDate: '2021-07-22', performance: 85, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1056', name: 'Nadia Osei', email: 'nadia.o@enterprise.io', role: 'Finance Manager', department: 'Finance', status: 'Pending', salary: 131000, joinDate: '2020-06-09', performance: 89, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1057', name: 'Ravi Subramaniam', email: 'ravi.s@enterprise.io', role: 'Cloud Engineer', department: 'Engineering', status: 'Inactive', salary: 141000, joinDate: '2022-03-11', performance: 86, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1058', name: 'Isabella Rossi', email: 'isabella.r@enterprise.io', role: 'Brand Manager', department: 'Marketing', status: 'Suspended', salary: 105000, joinDate: '2023-09-25', performance: 73, avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1059', name: 'Noah Bennett', email: 'noah.b@enterprise.io', role: 'Support Engineer', department: 'Engineering', status: 'Active', salary: 100000, joinDate: '2023-04-03', performance: 80, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1060', name: 'Priya Nair', email: 'priya.n@enterprise.io', role: 'Talent Acquisition Lead', department: 'Human Resources', status: 'Pending', salary: 102000, joinDate: '2022-10-14', performance: 82, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1061', name: 'Alexander Wright', email: 'alexander.w@enterprise.io', role: 'Engineering Lead', department: 'Engineering', status: 'Suspended', salary: 149500, joinDate: '2021-03-15', performance: 88, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1062', name: 'Sophia Chen', email: 'sophia.c@enterprise.io', role: 'Senior Designer', department: 'Design', status: 'Active', salary: 122500, joinDate: '2022-01-10', performance: 82, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1063', name: 'Marcus Vance', email: 'marcus.v@enterprise.io', role: 'Product Manager', department: 'Product', status: 'Pending', salary: 136500, joinDate: '2023-06-01', performance: 73, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1064', name: 'Elena Rostova', email: 'elena.r@enterprise.io', role: 'Data Analyst', department: 'Analytics', status: 'Inactive', salary: 109500, joinDate: '2022-09-20', performance: 85, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1065', name: 'David Kim', email: 'david.k@enterprise.io', role: 'DevOps Architect', department: 'Engineering', status: 'Suspended', salary: 154500, joinDate: '2020-11-05', performance: 90, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1066', name: 'Jessica Miller', email: 'jessica.m@enterprise.io', role: 'Marketing Director', department: 'Marketing', status: 'Active', salary: 129500, joinDate: '2019-04-12', performance: 59, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1067', name: 'Liam O\'Connor', email: 'liam.o@enterprise.io', role: 'Backend Engineer', department: 'Engineering', status: 'Pending', salary: 116500, joinDate: '2023-02-14', performance: 79, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1068', name: 'Amara Patel', email: 'amara.p@enterprise.io', role: 'UX Researcher', department: 'Design', status: 'Inactive', salary: 102500, joinDate: '2023-08-19', performance: 84, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1069', name: 'Lucas Sterling', email: 'lucas.s@enterprise.io', role: 'Account Executive', department: 'Sales', status: 'Suspended', salary: 96500, joinDate: '2021-08-01', performance: 36, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1070', name: 'Zoe Thorne', email: 'zoe.t@enterprise.io', role: 'QA Lead', department: 'Engineering', status: 'Active', salary: 112500, joinDate: '2023-11-01', performance: 77, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1071', name: 'Gabriel Torres', email: 'gabriel.t@enterprise.io', role: 'Security Analyst', department: 'Engineering', status: 'Pending', salary: 139500, joinDate: '2021-12-03', performance: 86, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1072', name: 'Chloe Dubois', email: 'chloe.d@enterprise.io', role: 'Content Strategist', department: 'Marketing', status: 'Inactive', salary: 93500, joinDate: '2022-05-18', performance: 81, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1073', name: 'Ethan Harper', email: 'ethan.h@enterprise.io', role: 'Sales Manager', department: 'Sales', status: 'Suspended', salary: 144500, joinDate: '2020-02-28', performance: 89, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1074', name: 'Maya Lin', email: 'maya.l@enterprise.io', role: 'Frontend Engineer', department: 'Engineering', status: 'Active', salary: 119500, joinDate: '2024-01-15', performance: 75, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1075', name: 'Carlos Mendez', email: 'carlos.m@enterprise.io', role: 'HR Business Partner', department: 'Human Resources', status: 'Pending', salary: 99500, joinDate: '2021-07-22', performance: 83, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1076', name: 'Nadia Osei', email: 'nadia.o@enterprise.io', role: 'Finance Manager', department: 'Finance', status: 'Inactive', salary: 132500, joinDate: '2020-06-09', performance: 87, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1077', name: 'Ravi Subramaniam', email: 'ravi.s@enterprise.io', role: 'Cloud Engineer', department: 'Engineering', status: 'Suspended', salary: 142500, joinDate: '2022-03-11', performance: 84, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1078', name: 'Isabella Rossi', email: 'isabella.r@enterprise.io', role: 'Brand Manager', department: 'Marketing', status: 'Active', salary: 106500, joinDate: '2023-09-25', performance: 71, avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1079', name: 'Noah Bennett', email: 'noah.b@enterprise.io', role: 'Support Engineer', department: 'Engineering', status: 'Pending', salary: 101500, joinDate: '2023-04-03', performance: 78, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1080', name: 'Priya Nair', email: 'priya.n@enterprise.io', role: 'Talent Acquisition Lead', department: 'Human Resources', status: 'Inactive', salary: 103500, joinDate: '2022-10-14', performance: 80, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1081', name: 'Alexander Wright', email: 'alexander.w@enterprise.io', role: 'Engineering Lead', department: 'Engineering', status: 'Active', salary: 151000, joinDate: '2021-03-15', performance: 86, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1082', name: 'Sophia Chen', email: 'sophia.c@enterprise.io', role: 'Senior Designer', department: 'Design', status: 'Pending', salary: 124000, joinDate: '2022-01-10', performance: 80, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1083', name: 'Marcus Vance', email: 'marcus.v@enterprise.io', role: 'Product Manager', department: 'Product', status: 'Inactive', salary: 138000, joinDate: '2023-06-01', performance: 71, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1084', name: 'Elena Rostova', email: 'elena.r@enterprise.io', role: 'Data Analyst', department: 'Analytics', status: 'Suspended', salary: 111000, joinDate: '2022-09-20', performance: 83, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1085', name: 'David Kim', email: 'david.k@enterprise.io', role: 'DevOps Architect', department: 'Engineering', status: 'Active', salary: 156000, joinDate: '2020-11-05', performance: 88, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1086', name: 'Jessica Miller', email: 'jessica.m@enterprise.io', role: 'Marketing Director', department: 'Marketing', status: 'Pending', salary: 131000, joinDate: '2019-04-12', performance: 57, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1087', name: 'Liam O\'Connor', email: 'liam.o@enterprise.io', role: 'Backend Engineer', department: 'Engineering', status: 'Inactive', salary: 118000, joinDate: '2023-02-14', performance: 77, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1088', name: 'Amara Patel', email: 'amara.p@enterprise.io', role: 'UX Researcher', department: 'Design', status: 'Suspended', salary: 104000, joinDate: '2023-08-19', performance: 82, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1089', name: 'Lucas Sterling', email: 'lucas.s@enterprise.io', role: 'Account Executive', department: 'Sales', status: 'Active', salary: 98000, joinDate: '2021-08-01', performance: 35, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1090', name: 'Zoe Thorne', email: 'zoe.t@enterprise.io', role: 'QA Lead', department: 'Engineering', status: 'Pending', salary: 114000, joinDate: '2023-11-01', performance: 75, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1091', name: 'Gabriel Torres', email: 'gabriel.t@enterprise.io', role: 'Security Analyst', department: 'Engineering', status: 'Inactive', salary: 141000, joinDate: '2021-12-03', performance: 84, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1092', name: 'Chloe Dubois', email: 'chloe.d@enterprise.io', role: 'Content Strategist', department: 'Marketing', status: 'Suspended', salary: 95000, joinDate: '2022-05-18', performance: 79, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1093', name: 'Ethan Harper', email: 'ethan.h@enterprise.io', role: 'Sales Manager', department: 'Sales', status: 'Active', salary: 146000, joinDate: '2020-02-28', performance: 87, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1094', name: 'Maya Lin', email: 'maya.l@enterprise.io', role: 'Frontend Engineer', department: 'Engineering', status: 'Pending', salary: 121000, joinDate: '2024-01-15', performance: 73, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1095', name: 'Carlos Mendez', email: 'carlos.m@enterprise.io', role: 'HR Business Partner', department: 'Human Resources', status: 'Inactive', salary: 101000, joinDate: '2021-07-22', performance: 81, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1096', name: 'Nadia Osei', email: 'nadia.o@enterprise.io', role: 'Finance Manager', department: 'Finance', status: 'Suspended', salary: 134000, joinDate: '2020-06-09', performance: 85, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1097', name: 'Ravi Subramaniam', email: 'ravi.s@enterprise.io', role: 'Cloud Engineer', department: 'Engineering', status: 'Active', salary: 144000, joinDate: '2022-03-11', performance: 82, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1098', name: 'Isabella Rossi', email: 'isabella.r@enterprise.io', role: 'Brand Manager', department: 'Marketing', status: 'Pending', salary: 108000, joinDate: '2023-09-25', performance: 69, avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1099', name: 'Noah Bennett', email: 'noah.b@enterprise.io', role: 'Support Engineer', department: 'Engineering', status: 'Inactive', salary: 103000, joinDate: '2023-04-03', performance: 76, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'USR-1100', name: 'Priya Nair', email: 'priya.n@enterprise.io', role: 'Talent Acquisition Lead', department: 'Human Resources', status: 'Suspended', salary: 105000, joinDate: '2022-10-14', performance: 78, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' }
];

const ALL_COLUMNS = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'User / Employee', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true },
  { key: 'performance', label: 'Performance', sortable: true },
  { key: 'joinDate', label: 'Joined', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Product', 'Analytics', 'Marketing', 'Sales', 'Human Resources'];
const STATUSES = ['All', 'Active', 'Pending', 'Inactive', 'Suspended'];

export default function ModifyUserContent() {
  const [data, setData] = useState(INITIAL_DATA);
  const [darkMode, setDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'add', 'edit', 'view', 'delete'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const handleSaveRecord = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRecord = {
      id: selectedRecord?.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      department: formData.get('department'),
      status: formData.get('status'),
      salary: Number(formData.get('salary')),
      performance: Number(formData.get('performance')),
      joinDate: formData.get('joinDate') || new Date().toISOString().split('T')[0],
      avatar: selectedRecord?.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`
    };

    if (activeModal === 'edit') {
      setData((prev) => prev.map((item) => (item.id === newRecord.id ? newRecord : item)));
      showToast('User record updated successfully!');
    } else {
      setData((prev) => [newRecord, ...prev]);
      showToast('New user added successfully!');
    }
    setActiveModal(null);
    setSelectedRecord(null);
  };

  const handleDeleteRecord = () => {
    if (selectedRecord) {
      setData((prev) => prev.filter((item) => item.id !== selectedRecord.id));
      showToast(`Deleted ${selectedRecord.name}`, 'info');
    }
    setActiveModal(null);
    setSelectedRecord(null);
  };

  const stats = useMemo(() => {
    const total = data.length;
    const activeCount = data.filter((d) => d.status === 'Active').length;
    const pendingCount = data.filter((d) => d.status === 'Pending').length;
    const avgSalary = Math.round(data.reduce((acc, curr) => acc + curr.salary, 0) / (total || 1));
    return { total, activeCount, pendingCount, avgSalary };
  }, [data]);

  const filters = useMemo(
    () => [
      { key: 'department', label: 'Dept', options: DEPARTMENTS },
      { key: 'status', label: 'Status', options: STATUSES }
    ],
    []
  );

  return (
    <div className={`w-full font-sans transition-colors duration-200 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>

      <div className="w-full space-y-6">

        {/* DataTable now owns search, filters, density, columns, export, bulk-select, sort + pagination */}
        <DataTable
          data={data}
          columns={ALL_COLUMNS}
          searchKeys={['name', 'email', 'role', 'id']}
          filters={filters}
          darkMode={darkMode}
          exportFilenamePrefix="enterprise_users"
          onView={(row) => {
            setSelectedRecord(row);
            setActiveModal('view');
          }}
          onEdit={(row) => {
            setSelectedRecord(row);
            setActiveModal('edit');
          }}
          onDelete={(row) => {
            setSelectedRecord(row);
            setActiveModal('delete');
          }}
          onBulkDelete={(ids) => {
            setData((prev) => prev.filter((item) => !ids.includes(item.id)));
            showToast(`Removed ${ids.length} selected records`, 'info');
          }}
        />

      </div>

      {/* Add / Edit Modal */}
      {(activeModal === 'add' || activeModal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 overflow-hidden ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold">
                {activeModal === 'add' ? 'Add New Record' : 'Edit User Record'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedRecord?.name || ''}
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={selectedRecord?.email || ''}
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    name="role"
                    required
                    defaultValue={selectedRecord?.role || ''}
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Department</label>
                  <select
                    name="department"
                    defaultValue={selectedRecord?.department || 'Engineering'}
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {DEPARTMENTS.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedRecord?.status || 'Active'}
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {STATUSES.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Annual Salary ($)</label>
                  <input
                    type="number"
                    name="salary"
                    required
                    defaultValue={selectedRecord?.salary || 90000}
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Performance Rating (%)</label>
                  <input
                    type="number"
                    name="performance"
                    min="1"
                    max="100"
                    required
                    defaultValue={selectedRecord?.performance || 85}
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Join Date</label>
                  <input
                    type="date"
                    name="joinDate"
                    defaultValue={selectedRecord?.joinDate || new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {activeModal === 'view' && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 overflow-hidden ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedRecord.avatar}
                  alt={selectedRecord.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/30"
                />
                <div>
                  <h3 className="text-base font-bold">{selectedRecord.name}</h3>
                  <p className="text-xs text-indigo-500 font-mono">{selectedRecord.id}</p>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedRecord.email}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Role Title</span>
                <span className="font-medium text-xs">{selectedRecord.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Department</span>
                <span className="font-medium text-xs">{selectedRecord.department}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Status</span>
                <span className="font-medium text-xs">{selectedRecord.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Annual Compensation</span>
                <span className="font-mono font-medium text-xs">${selectedRecord.salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Performance Index</span>
                <span className="font-medium text-xs text-emerald-500">{selectedRecord.performance}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Joined Date</span>
                <span className="font-medium text-xs">{selectedRecord.joinDate}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {activeModal === 'delete' && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl border shadow-2xl p-6 text-center ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Confirm Delete</h3>
            <p className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Are you sure you want to remove <span className="font-semibold text-slate-900 dark:text-white">{selectedRecord.name}</span>? This action cannot be undone.
            </p>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRecord}
                className="flex-1 py-2 rounded-xl text-xs font-medium bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}