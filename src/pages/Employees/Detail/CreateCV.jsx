import { FileTextOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Button from '../../../components/atoms/Button/Button';
import { axiosInstance } from '../../../config/axios';

const CreateCV = ({ id }) => {
  const [dataCV, setDataCV] = useState();
  const [textCV, setTextCV] = useState('');

  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       apiKey: ALI_KEY,
  //       clientId: CLIENT_ID,
  //       scope: SCOPES,
  //     });
  //   }
  //   gapi.load('client:auth2', start);
  // });

  useEffect(() => {
    axiosInstance(`employees/${id}`)
      .then((res) => res.data)
      .then((data) => {
        setDataCV(data);

        axiosInstance('projects')
          .then((res) => res.data)
          .then((res) => {
            const allProjects = res;
            var typicalProjectString = '';

            allProjects.forEach((project) => {
              var isExist = project.member.find((m) => m.id === id);
              if (isExist) {
                typicalProjectString += `\n\nProject Name: ${
                  project.name
                }\nRole: ${isExist.role.join(', ')} \nDescription: ${
                  project.description
                } \nLanguages and Framework: ${project.technical.join(', ')}`;
              }
            });
            setTextCV(
              `${data.name.toUpperCase()}
            \nAddress: ${data.address}
            \nEmail: ${data.email}
            \n\nWORKING EXPERIENCE
            \n\nTYPICAL PROJECTS
            ${typicalProjectString}
            \n\nTECHNICAL SKILLS/QUALIFICATION\n\n
            `,
            );
          });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [id]);

  function zerofill(i) {
    return (i < 10 ? '0' : '') + i;
  }

  function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = zerofill(date.getMonth() + 1);
    const day = zerofill(date.getDate());

    return year + '-' + month + '-' + day;
  }

  function getTimeString() {
    const date = new Date();
    return date.toLocaleTimeString();
  }

  const styleHeading = [];
  const styleTitleProject = [
    {
      title: 'Project Name:',
      indexes: [],
    },
    {
      title: 'Role:',
      indexes: [],
    },
    {
      title: 'Description:',
      indexes: [],
    },
    {
      title: 'Languages and Framework:',
      indexes: [],
    },
  ];

  /* range for name */
  styleHeading.push({
    startIndex: 1,
    endIndex: 1 + dataCV?.name.length,
  });
  /* range for heading */
  [
    'WORKING EXPERIENCE',
    'TYPICAL PROJECTS',
    'TECHNICAL SKILLS/QUALIFICATION',
  ].forEach((item) => {
    const startIndex = textCV.indexOf(item);
    styleHeading.push({
      startIndex: startIndex,
      endIndex: startIndex + item.length + 1,
    });
  });

  /* range for title project */
  for (let i = 0; i < styleTitleProject.length; i++) {
    let index = textCV.indexOf(styleTitleProject[i].title);
    while (index !== -1) {
      styleTitleProject[i].indexes.push({
        startIndex: index,
        endIndex: index + styleTitleProject[i].title.length + 1,
      });
      index = textCV.indexOf(styleTitleProject[i].title, index + 1);
    }
  }

  /* cast range index into request */
  const textStyleHeadingRequests = styleHeading.map((range) => ({
    updateTextStyle: {
      range: {
        startIndex: range.startIndex,
        endIndex: range.endIndex + 1, // Add 1 to endIndex to include the newline character
      },
      textStyle: {
        bold: true,
        fontSize: {
          magnitude: 16,
          unit: 'PT',
        },
        foregroundColor: {
          color: {
            rgbColor: {
              red: parseInt('#333333'.slice(1, 3), 16) / 255,
              green: parseInt('#333333'.slice(3, 5), 16) / 255,
              blue: parseInt('#333333'.slice(5, 7), 16) / 255,
            },
          },
        },
      },
      fields: 'bold, fontSize, foregroundColor',
    },
  }));
  const textStyleTitleProjectRequests = styleTitleProject.map((range) => {
    return range.indexes.map((r) => {
      return {
        updateTextStyle: {
          range: {
            startIndex: r.startIndex,
            endIndex: r.endIndex + 1, // Add 1 to endIndex to include the newline character
          },
          textStyle: {
            bold: true,
            fontSize: {
              magnitude: 12,
              unit: 'PT',
            },
            foregroundColor: {
              color: {
                rgbColor: {
                  red: 0.0,
                  green: 0.0,
                  blue: 0.0,
                },
              },
            },
          },
          fields: 'bold, fontSize, foregroundColor',
        },
      };
    });
  });

  /* add range for table */
  const tableStartIndex = textCV.length + 5;
  const gapCol = 2;
  const gapRow = 5;

  const tableCommands = [];

  // Thêm dữ liệu cho mỗi kỹ năng trong dataCV.skills

  for (let index = dataCV?.skills.length - 1; index >= 0; index--) {
    const rowIndex = tableStartIndex + (index + 1) * gapRow;

    // Thêm kinh nghiệm
    tableCommands.push({
      insertText: {
        location: {
          index: rowIndex + gapCol,
        },
        text: dataCV.skills[index].exp,
      },
    });
    // Thêm tên kỹ năng
    tableCommands.push({
      insertText: {
        location: {
          index: rowIndex,
        },
        text: dataCV.skills[index].skillname,
      },
    });
  }

  // Thêm tiêu đề cột
  tableCommands.push({
    insertText: {
      location: {
        index: tableStartIndex + gapCol,
      },
      text: 'EXPERIENCE (in year)',
    },
  });
  tableCommands.push({
    insertText: {
      location: {
        index: tableStartIndex,
      },
      text: 'SKILL',
    },
  });

  /* create file */
  const createCV = (id) => {
    console.log('Create CV for id ', id);
  };

  return (
    <Button
      shape="round"
      icon={<FileTextOutlined />}
      className="ms-2"
      onClick={() => createCV(id)}
    >
      CV
    </Button>
  );
};

export default CreateCV;
