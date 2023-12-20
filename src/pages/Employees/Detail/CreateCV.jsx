import { FileTextOutlined } from '@ant-design/icons';
import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import Button from '../../../components/atoms/Button/Button';
import { axiosInstance } from '../../../config/axios';

const CLIENT_ID =
  '152682156074-fq1afatnt37fovivqhho9pq5pvmj0i7u.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBSSnXEekYrz - L - cMPyrP5ST1Qwz66dFRA';
const SCOPES = 'https://www.googleapis.com/auth/drive';

const CreateCV = ({ id }) => {
  const [dataCV, setDataCV] = useState();
  const [textCV, setTextCV] = useState('');

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    }
    gapi.load('client:auth2', start);
  });

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
                  project.description ? project.description : ''
                } \nLanguages and Framework: ${project.technical.join(', ')}`;
              }
            });

            const dateString = data?.createdAt;
            const date = new Date(dateString);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString();

            const formattedDate = `${month}/${year}`;

            setTextCV(
              `${data.name.toUpperCase()}\nAddress: ${data.address}\nEmail: ${
                data.email
              }
            \n\nWORKING EXPERIENCE
            \n${formattedDate} - now\n${
                data.position[0].toUpperCase() + data.position.slice(1)
              } at DevPlus – Da Nang${
                data.description ? `\n${data.description}` : ''
              }
            \nLanguages and Framework: ${data.skills
              .map((k) => k.skillname)
              .join(', ')}
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
        text: dataCV.skills[index].exp + " ",
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
    var accessToken =
      'ya29.a0AfB_byAes-Bo1wYjfr8NBuKVZjWfvwD41jhZlfmtVwgkymZZBfG7S7vZt5VLhbFDHHUWgqoachqwWsyfR0xWIohFGr7YXqsn0LrjZXCxUkcDNSilKEm3ZljL8sE89OzwY-954X-WOOrNSDQhUWdC4-5Xe7tkoXdCjwaCgYKAZQSARISFQHGX2Mil-lHDhv_9wlF5sLVx2fs5A0169';
    var filename =
      dataCV?.name + ' CV, ' + getDateString() + ' ' + getTimeString();

    fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        title: filename,
      }),
    })
      .then((res) => res.json())
      .then((document) => {
        // console.log(document);
        const documentId = document.documentId;

        // Step 2: Update the document content
        fetch(
          `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
          {
            method: 'POST',
            headers: new Headers({
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              requests: [
                {
                  insertText: {
                    location: {
                      index: 1, // Start at the beginning of the document
                    },
                    text: textCV,
                  },
                },
                {
                  updateTextStyle: {
                    range: {
                      startIndex: 1,
                      endIndex: textCV.length + 1, // Add 1 to endIndex to include the newline character
                    },
                    textStyle: {
                      fontSize: {
                        magnitude: 12,
                        unit: 'PT',
                      },
                      foregroundColor: {
                        color: {
                          rgbColor: {
                            red: 88 / 255,
                            green: 88 / 255,
                            blue: 88 / 255,
                          },
                        },
                      },
                    },
                    fields: 'fontSize, foregroundColor',
                  },
                },
                {
                  updateTextStyle: {
                    range: {
                      startIndex: textCV.indexOf('WORKING EXPERIENCE'),
                      endIndex: textCV.indexOf('WORKING EXPERIENCE') + 46,
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
                },
                {
                  updateTextStyle: {
                    range: {
                      startIndex: textCV.indexOf('WORKING EXPERIENCE') + 46,
                      endIndex:
                        textCV.indexOf('WORKING EXPERIENCE') +
                        90 +
                        dataCV.description.length,
                    },
                    textStyle: {
                      italic: true,
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
                    fields: 'italic, fontSize, foregroundColor',
                  },
                },
                ...textStyleHeadingRequests,
                ...textStyleTitleProjectRequests,
                {
                  insertTable: {
                    endOfSegmentLocation: {
                      segmentId: '',
                    },
                    columns: 2,
                    rows: dataCV.skills.length + 1,
                  },
                },
                ...tableCommands,
              ],
            }),
          },
        )
          .then((res) => res.json())
          .then(() => {
            // Step 3: Open the document in a new tab
            window.open(
              'https://docs.google.com/document/d/' + documentId + '/edit',
              '_blank',
            );
          })
          .catch((error) => {
            console.error('Error updating document content:', error);
          });
      })
      .catch((error) => {
        console.error('Error creating document:', error);
      });
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
