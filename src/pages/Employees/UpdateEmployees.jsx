import Breadcrumb from './../../components/molecules/Breadcrumb/Breadcrumb';
import React, { useState, useEffect } from 'react';
import UpdateForm from './UpdateForm'; 

const UpdateEmployees = () => {
  const [employeeData, setEmployeeData] = useState();

  const breadcrumbItems = [
    { key: 'employees', route: '/employees' },
    { key: 'employees_update', route: '/employees/update' },
  ];

  useEffect(() => {
   
    setEmployeeData();
  }, []);

  const handleUpdate = () => {
 
  };

  return (
    <>
    
      <div id="update_employees">
        {/* Render thành phần UpdateForm */}
        <UpdateForm employeeData={employeeData} onUpdate={handleUpdate} />
      </div>
    </>
  );
};

export default UpdateEmployees;
