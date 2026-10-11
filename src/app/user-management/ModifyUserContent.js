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
  { id: 1, username: 'daniel.rostova', email: 'daniel.rostova@company.com', firstName: 'Daniel', secondName: 'Rostova', status: 'Inactive', createdBy: 'admin.root', createdDate: '2019-05-03' },
  { id: 2, username: 'marcusoco', email: 'marcusoco@company.com', firstName: 'Marcus', secondName: 'OConnor', status: 'Active', createdBy: 'gracehug', createdDate: '2021-03-25' },
  { id: 3, username: 'mia_reed', email: 'mia_reed@company.com', firstName: 'Mia', secondName: 'Reed', status: 'Active', createdBy: 'henryfos', createdDate: '2022-02-13' },
  { id: 4, username: 'henry.novak', email: 'henry.novak@company.com', firstName: 'Henry', secondName: 'Novak', status: 'Active', createdBy: 'danielpar', createdDate: '2023-09-28' },
  { id: 5, username: 'gabrielste', email: 'gabrielste@company.com', firstName: 'Gabriel', secondName: 'Sterling', status: 'Active', createdBy: 'oreed', createdDate: '2020-02-23' },
  { id: 6, username: 'marcus.harper', email: 'marcus.harper@company.com', firstName: 'Marcus', secondName: 'Harper', status: 'Inactive', createdBy: 'oreed', createdDate: '2021-12-19' },
  { id: 7, username: 'henry_chen', email: 'henry_chen@company.com', firstName: 'Henry', secondName: 'Chen', status: 'Active', createdBy: 'henryfos', createdDate: '2019-11-19' },
  { id: 8, username: 'ithorne', email: 'ithorne@company.com', firstName: 'Isabella', secondName: 'Thorne', status: 'Active', createdBy: 'danielpar', createdDate: '2019-10-12' },
  { id: 9, username: 'sophiaben', email: 'sophiaben@company.com', firstName: 'Sophia', secondName: 'Bennett', status: 'Inactive', createdBy: 'admin.root', createdDate: '2021-08-11' },
  { id: 10, username: 'leo_rostova', email: 'leo_rostova@company.com', firstName: 'Leo', secondName: 'Rostova', status: 'Inactive', createdBy: 'henryfos', createdDate: '2023-02-03' },
  { id: 11, username: 'jdubois', email: 'jdubois@company.com', firstName: 'Jessica', secondName: 'Dubois', status: 'Active', createdBy: 'danielpar', createdDate: '2021-12-29' },
  { id: 12, username: 'mia.brooks', email: 'mia.brooks@company.com', firstName: 'Mia', secondName: 'Brooks', status: 'Active', createdBy: 'gracehug', createdDate: '2021-09-29' },
  { id: 13, username: 'jessica_mendez', email: 'jessica_mendez@company.com', firstName: 'Jessica', secondName: 'Mendez', status: 'Inactive', createdBy: 'danielpar', createdDate: '2021-06-18' },
  { id: 14, username: 'james.torres', email: 'james.torres@company.com', firstName: 'James', secondName: 'Torres', status: 'Active', createdBy: 'admin.root', createdDate: '2022-07-16' },
  { id: 15, username: 'ethan.sterling', email: 'ethan.sterling@company.com', firstName: 'Ethan', secondName: 'Sterling', status: 'Active', createdBy: 'gracehug', createdDate: '2022-07-12' },
  { id: 16, username: 'liam_reed', email: 'liam_reed@company.com', firstName: 'Liam', secondName: 'Reed', status: 'Inactive', createdBy: 'danielpar', createdDate: '2024-02-23' },
  { id: 17, username: 'davidste', email: 'davidste@company.com', firstName: 'David', secondName: 'Sterling', status: 'Active', createdBy: 'danielpar', createdDate: '2021-12-12' },
  { id: 18, username: 'daniel_bennett', email: 'daniel_bennett@company.com', firstName: 'Daniel', secondName: 'Bennett', status: 'Inactive', createdBy: 'oreed', createdDate: '2021-06-17' },
  { id: 19, username: 'david_subramaniam', email: 'david_subramaniam@company.com', firstName: 'David', secondName: 'Subramaniam', status: 'Active', createdBy: 'admin.root', createdDate: '2020-03-25' },
  { id: 20, username: 'davidree', email: 'davidree@company.com', firstName: 'David', secondName: 'Reed', status: 'Inactive', createdBy: 'gracehug', createdDate: '2019-09-18' },
  { id: 21, username: 'ethan_harper', email: 'ethan_harper@company.com', firstName: 'Ethan', secondName: 'Harper', status: 'Inactive', createdBy: 'gracehug', createdDate: '2019-02-17' },
  { id: 22, username: 'james.hughes', email: 'james.hughes@company.com', firstName: 'James', secondName: 'Hughes', status: 'Inactive', createdBy: 'danielpar', createdDate: '2022-10-25' },
  { id: 23, username: 'elena_thorne', email: 'elena_thorne@company.com', firstName: 'Elena', secondName: 'Thorne', status: 'Active', createdBy: 'henryfos', createdDate: '2019-01-14' },
  { id: 24, username: 'dadler', email: 'dadler@company.com', firstName: 'Daniel', secondName: 'Adler', status: 'Active', createdBy: 'gracehug', createdDate: '2020-03-11' },
  { id: 25, username: 'lreed', email: 'lreed@company.com', firstName: 'Leo', secondName: 'Reed', status: 'Active', createdBy: 'system.bot', createdDate: '2023-03-12' },
  { id: 26, username: 'ava.miller', email: 'ava.miller@company.com', firstName: 'Ava', secondName: 'Miller', status: 'Inactive', createdBy: 'henryfos', createdDate: '2019-03-21' },
  { id: 27, username: 'ebrooks', email: 'ebrooks@company.com', firstName: 'Elena', secondName: 'Brooks', status: 'Inactive', createdBy: 'system.bot', createdDate: '2019-08-26' },
  { id: 28, username: 'amara.adler', email: 'amara.adler@company.com', firstName: 'Amara', secondName: 'Adler', status: 'Active', createdBy: 'danielpar', createdDate: '2024-06-13' },
  { id: 29, username: 'gracevan', email: 'gracevan@company.com', firstName: 'Grace', secondName: 'Vance', status: 'Active', createdBy: 'danielpar', createdDate: '2024-04-30' },
  { id: 30, username: 'imiller', email: 'imiller@company.com', firstName: 'Isabella', secondName: 'Miller', status: 'Inactive', createdBy: 'system.bot', createdDate: '2021-04-03' },
  { id: 31, username: 'mia_thorne', email: 'mia_thorne@company.com', firstName: 'Mia', secondName: 'Thorne', status: 'Inactive', createdBy: 'henryfos', createdDate: '2024-10-20' },
  { id: 32, username: 'carlosros', email: 'carlosros@company.com', firstName: 'Carlos', secondName: 'Rostova', status: 'Active', createdBy: 'admin.root', createdDate: '2022-10-16' },
  { id: 33, username: 'alexanderben', email: 'alexanderben@company.com', firstName: 'Alexander', secondName: 'Bennett', status: 'Active', createdBy: 'admin.root', createdDate: '2019-10-18' },
  { id: 34, username: 'mia.reed', email: 'mia.reed@company.com', firstName: 'Mia', secondName: 'Reed', status: 'Active', createdBy: 'admin.root', createdDate: '2019-05-09' },
  { id: 35, username: 'leo.torres', email: 'leo.torres@company.com', firstName: 'Leo', secondName: 'Torres', status: 'Active', createdBy: 'oreed', createdDate: '2024-06-11' },
  { id: 36, username: 'liamros', email: 'liamros@company.com', firstName: 'Liam', secondName: 'Rossi', status: 'Inactive', createdBy: 'system.bot', createdDate: '2024-04-21' },
  { id: 37, username: 'henrylin', email: 'henrylin@company.com', firstName: 'Henry', secondName: 'Lin', status: 'Active', createdBy: 'admin.root', createdDate: '2023-11-01' },
  { id: 38, username: 'chloe_lin', email: 'chloe_lin@company.com', firstName: 'Chloe', secondName: 'Lin', status: 'Inactive', createdBy: 'danielpar', createdDate: '2019-08-10' },
  { id: 39, username: 'james.reed', email: 'james.reed@company.com', firstName: 'James', secondName: 'Reed', status: 'Active', createdBy: 'henryfos', createdDate: '2022-10-21' },
  { id: 40, username: 'henry.novak1', email: 'henry.novak1@company.com', firstName: 'Henry', secondName: 'Novak', status: 'Active', createdBy: 'system.bot', createdDate: '2021-02-18' },
  { id: 41, username: 'isabellamen', email: 'isabellamen@company.com', firstName: 'Isabella', secondName: 'Mendez', status: 'Inactive', createdBy: 'system.bot', createdDate: '2022-02-14' },
  { id: 42, username: 'carlos.patel', email: 'carlos.patel@company.com', firstName: 'Carlos', secondName: 'Patel', status: 'Inactive', createdBy: 'gracehug', createdDate: '2020-02-06' },
  { id: 43, username: 'sophia.reed', email: 'sophia.reed@company.com', firstName: 'Sophia', secondName: 'Reed', status: 'Active', createdBy: 'system.bot', createdDate: '2020-11-12' },
  { id: 44, username: 'maya_osei', email: 'maya_osei@company.com', firstName: 'Maya', secondName: 'Osei', status: 'Active', createdBy: 'henryfos', createdDate: '2019-08-29' },
  { id: 45, username: 'jessica.harper', email: 'jessica.harper@company.com', firstName: 'Jessica', secondName: 'Harper', status: 'Inactive', createdBy: 'oreed', createdDate: '2024-02-07' },
  { id: 46, username: 'zoe_lin', email: 'zoe_lin@company.com', firstName: 'Zoe', secondName: 'Lin', status: 'Active', createdBy: 'system.bot', createdDate: '2022-04-30' },
  { id: 47, username: 'liam.chen', email: 'liam.chen@company.com', firstName: 'Liam', secondName: 'Chen', status: 'Inactive', createdBy: 'admin.root', createdDate: '2019-07-25' },
  { id: 48, username: 'noahose', email: 'noahose@company.com', firstName: 'Noah', secondName: 'Osei', status: 'Active', createdBy: 'gracehug', createdDate: '2019-11-25' },
  { id: 49, username: 'leo.miller', email: 'leo.miller@company.com', firstName: 'Leo', secondName: 'Miller', status: 'Active', createdBy: 'danielpar', createdDate: '2021-08-21' },
  { id: 50, username: 'ethanros', email: 'ethanros@company.com', firstName: 'Ethan', secondName: 'Rostova', status: 'Active', createdBy: 'gracehug', createdDate: '2019-12-02' },
  { id: 51, username: 'mbennett', email: 'mbennett@company.com', firstName: 'Maya', secondName: 'Bennett', status: 'Inactive', createdBy: 'system.bot', createdDate: '2022-07-10' },
  { id: 52, username: 'amara_sterling', email: 'amara_sterling@company.com', firstName: 'Amara', secondName: 'Sterling', status: 'Active', createdBy: 'danielpar', createdDate: '2022-05-13' },
  { id: 53, username: 'carlos.torres', email: 'carlos.torres@company.com', firstName: 'Carlos', secondName: 'Torres', status: 'Active', createdBy: 'henryfos', createdDate: '2020-02-14' },
  { id: 54, username: 'marcusros', email: 'marcusros@company.com', firstName: 'Marcus', secondName: 'Rossi', status: 'Inactive', createdBy: 'system.bot', createdDate: '2022-11-30' },
  { id: 55, username: 'ellavan', email: 'ellavan@company.com', firstName: 'Ella', secondName: 'Vance', status: 'Inactive', createdBy: 'oreed', createdDate: '2020-10-08' },
  { id: 56, username: 'csilva', email: 'csilva@company.com', firstName: 'Carlos', secondName: 'Silva', status: 'Active', createdBy: 'danielpar', createdDate: '2022-05-11' },
  { id: 57, username: 'jack.bennett', email: 'jack.bennett@company.com', firstName: 'Jack', secondName: 'Bennett', status: 'Active', createdBy: 'oreed', createdDate: '2020-04-17' },
  { id: 58, username: 'ellaros', email: 'ellaros@company.com', firstName: 'Ella', secondName: 'Rostova', status: 'Inactive', createdBy: 'oreed', createdDate: '2021-05-12' },
  { id: 59, username: 'miator', email: 'miator@company.com', firstName: 'Mia', secondName: 'Torres', status: 'Inactive', createdBy: 'gracehug', createdDate: '2024-06-24' },
  { id: 60, username: 'lucas.adler', email: 'lucas.adler@company.com', firstName: 'Lucas', secondName: 'Adler', status: 'Active', createdBy: 'danielpar', createdDate: '2023-10-01' },
  { id: 61, username: 'grace.sterling', email: 'grace.sterling@company.com', firstName: 'Grace', secondName: 'Sterling', status: 'Active', createdBy: 'oreed', createdDate: '2020-06-19' },
  { id: 62, username: 'oliviaste', email: 'oliviaste@company.com', firstName: 'Olivia', secondName: 'Sterling', status: 'Inactive', createdBy: 'gracehug', createdDate: '2023-10-18' },
  { id: 63, username: 'isabella.wright', email: 'isabella.wright@company.com', firstName: 'Isabella', secondName: 'Wright', status: 'Active', createdBy: 'danielpar', createdDate: '2020-09-02' },
  { id: 64, username: 'ichen', email: 'ichen@company.com', firstName: 'Isabella', secondName: 'Chen', status: 'Active', createdBy: 'henryfos', createdDate: '2020-06-06' },
  { id: 65, username: 'sthorne', email: 'sthorne@company.com', firstName: 'Sophia', secondName: 'Thorne', status: 'Active', createdBy: 'oreed', createdDate: '2021-05-10' },
  { id: 66, username: 'james.patel', email: 'james.patel@company.com', firstName: 'James', secondName: 'Patel', status: 'Inactive', createdBy: 'gracehug', createdDate: '2023-07-23' },
  { id: 67, username: 'priyahug', email: 'priyahug@company.com', firstName: 'Priya', secondName: 'Hughes', status: 'Active', createdBy: 'system.bot', createdDate: '2020-12-26' },
  { id: 68, username: 'ella.lin', email: 'ella.lin@company.com', firstName: 'Ella', secondName: 'Lin', status: 'Active', createdBy: 'danielpar', createdDate: '2022-09-22' },
  { id: 69, username: 'henry_brooks', email: 'henry_brooks@company.com', firstName: 'Henry', secondName: 'Brooks', status: 'Active', createdBy: 'oreed', createdDate: '2020-10-14' },
  { id: 70, username: 'henry.foster', email: 'henry.foster@company.com', firstName: 'Henry', secondName: 'Foster', status: 'Inactive', createdBy: 'admin.root', createdDate: '2024-04-11' },
  { id: 71, username: 'amara_oconnor', email: 'amara_oconnor@company.com', firstName: 'Amara', secondName: 'OConnor', status: 'Inactive', createdBy: 'oreed', createdDate: '2021-07-21' },
  { id: 72, username: 'amarawri', email: 'amarawri@company.com', firstName: 'Amara', secondName: 'Wright', status: 'Inactive', createdBy: 'oreed', createdDate: '2022-02-15' },
  { id: 73, username: 'lvance', email: 'lvance@company.com', firstName: 'Leo', secondName: 'Vance', status: 'Inactive', createdBy: 'danielpar', createdDate: '2024-09-17' },
  { id: 74, username: 'ebennett', email: 'ebennett@company.com', firstName: 'Ethan', secondName: 'Bennett', status: 'Active', createdBy: 'admin.root', createdDate: '2021-12-05' },
  { id: 75, username: 'jbennett', email: 'jbennett@company.com', firstName: 'Jessica', secondName: 'Bennett', status: 'Active', createdBy: 'admin.root', createdDate: '2023-11-15' },
  { id: 76, username: 'chughes', email: 'chughes@company.com', firstName: 'Chloe', secondName: 'Hughes', status: 'Inactive', createdBy: 'gracehug', createdDate: '2024-09-25' },
  { id: 77, username: 'elenahar', email: 'elenahar@company.com', firstName: 'Elena', secondName: 'Harper', status: 'Inactive', createdBy: 'admin.root', createdDate: '2023-11-22' },
  { id: 78, username: 'alexandersub', email: 'alexandersub@company.com', firstName: 'Alexander', secondName: 'Subramaniam', status: 'Inactive', createdBy: 'henryfos', createdDate: '2019-10-14' },
  { id: 79, username: 'jbrooks', email: 'jbrooks@company.com', firstName: 'James', secondName: 'Brooks', status: 'Inactive', createdBy: 'danielpar', createdDate: '2020-05-25' },
  { id: 80, username: 'dadler1', email: 'dadler1@company.com', firstName: 'Daniel', secondName: 'Adler', status: 'Inactive', createdBy: 'danielpar', createdDate: '2023-07-31' },
  { id: 81, username: 'gharper', email: 'gharper@company.com', firstName: 'Gabriel', secondName: 'Harper', status: 'Active', createdBy: 'system.bot', createdDate: '2023-09-19' },
  { id: 82, username: 'jameshar', email: 'jameshar@company.com', firstName: 'James', secondName: 'Harper', status: 'Inactive', createdBy: 'henryfos', createdDate: '2019-01-02' },
  { id: 83, username: 'zoetho', email: 'zoetho@company.com', firstName: 'Zoe', secondName: 'Thorne', status: 'Inactive', createdBy: 'gracehug', createdDate: '2022-08-12' },
  { id: 84, username: 'carlos_mendez', email: 'carlos_mendez@company.com', firstName: 'Carlos', secondName: 'Mendez', status: 'Active', createdBy: 'gracehug', createdDate: '2024-04-22' },
  { id: 85, username: 'henryadl', email: 'henryadl@company.com', firstName: 'Henry', secondName: 'Adler', status: 'Active', createdBy: 'oreed', createdDate: '2024-10-12' },
  { id: 86, username: 'jreed', email: 'jreed@company.com', firstName: 'James', secondName: 'Reed', status: 'Active', createdBy: 'system.bot', createdDate: '2022-06-25' },
  { id: 87, username: 'amarapar', email: 'amarapar@company.com', firstName: 'Amara', secondName: 'Park', status: 'Active', createdBy: 'admin.root', createdDate: '2019-07-09' },
  { id: 88, username: 'amara.osei', email: 'amara.osei@company.com', firstName: 'Amara', secondName: 'Osei', status: 'Inactive', createdBy: 'henryfos', createdDate: '2021-03-07' },
  { id: 89, username: 'mia_foster', email: 'mia_foster@company.com', firstName: 'Mia', secondName: 'Foster', status: 'Inactive', createdBy: 'henryfos', createdDate: '2021-09-26' },
  { id: 90, username: 'david.reed', email: 'david.reed@company.com', firstName: 'David', secondName: 'Reed', status: 'Active', createdBy: 'henryfos', createdDate: '2021-06-15' },
  { id: 91, username: 'jessica_park', email: 'jessica_park@company.com', firstName: 'Jessica', secondName: 'Park', status: 'Active', createdBy: 'gracehug', createdDate: '2021-10-17' },
  { id: 92, username: 'jack.novak', email: 'jack.novak@company.com', firstName: 'Jack', secondName: 'Novak', status: 'Inactive', createdBy: 'system.bot', createdDate: '2024-03-18' },
  { id: 93, username: 'jsubramaniam', email: 'jsubramaniam@company.com', firstName: 'James', secondName: 'Subramaniam', status: 'Inactive', createdBy: 'gracehug', createdDate: '2024-08-29' },
  { id: 94, username: 'maya_silva', email: 'maya_silva@company.com', firstName: 'Maya', secondName: 'Silva', status: 'Active', createdBy: 'danielpar', createdDate: '2024-04-28' },
  { id: 95, username: 'carlosste', email: 'carlosste@company.com', firstName: 'Carlos', secondName: 'Sterling', status: 'Inactive', createdBy: 'gracehug', createdDate: '2024-06-07' },
  { id: 96, username: 'opatel', email: 'opatel@company.com', firstName: 'Olivia', secondName: 'Patel', status: 'Inactive', createdBy: 'admin.root', createdDate: '2022-03-16' },
  { id: 97, username: 'asterling', email: 'asterling@company.com', firstName: 'Amara', secondName: 'Sterling', status: 'Inactive', createdBy: 'gracehug', createdDate: '2019-11-27' },
  { id: 98, username: 'davidkim', email: 'davidkim@company.com', firstName: 'David', secondName: 'Kim', status: 'Inactive', createdBy: 'danielpar', createdDate: '2020-09-17' },
  { id: 99, username: 'mia.oconnor', email: 'mia.oconnor@company.com', firstName: 'Mia', secondName: 'OConnor', status: 'Inactive', createdBy: 'henryfos', createdDate: '2022-09-17' },
  { id: 100, username: 'isabella_mendez', email: 'isabella_mendez@company.com', firstName: 'Isabella', secondName: 'Mendez', status: 'Active', createdBy: 'system.bot', createdDate: '2023-09-17' }
];

const ALL_COLUMNS = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'secondName', label: 'Second Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'createdDate', label: 'Created Date', sortable: true },
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
          defaultPinnedColumns={['id','name']}  // optional — pinned from the start
          defaultPinnedRightColumns={['actions']}
          searchKeys={['name', 'email', 'role', 'id']}
          filters={filters}
          darkMode={darkMode}
          //selectable={false}
          exportFilenamePrefix="enterprise_users"
          //showDensityToggle={false}   // hides the compact/normal/spacious toggle
          //showColumnsMenu={false}     // hides the Columns visibility dropdown
          //showExportMenu={false}      // hides Export (CSV/JSON/print)
          // 3. Dynamic row-level permission rules (Hide buttons conditionally per row)
          canView={true} 
          canEdit={true} // e.g., prevents editing Admin users
          canDelete={true} // e.g., prevents deleting active users
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
                <span className="font-medium text-xs">{selectedRecord.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Department</span>
                <span className="font-medium text-xs">{selectedRecord.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Status</span>
                <span className="font-medium text-xs">{selectedRecord.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Annual Compensation</span>
                <span className="font-mono font-medium text-xs">${selectedRecord.createdBy}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-xs">Performance Index</span>
                <span className="font-medium text-xs text-emerald-500">{selectedRecord.createdDate}%</span>
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