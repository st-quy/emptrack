import { FileTextOutlined } from '@ant-design/icons';
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/atoms/Button/Button';
import { Toast } from '../../../components/toast/Toast';
import { axiosInstance } from '../../../config/axios';

const CreateCV = ({ id }) => {
  const { t } = useTranslation();
  const [dataCV, setDataCV] = useState();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axiosInstance(`employees/${id}`)
      .then((res) => res.data)
      .then((data) => {
        setDataCV(data);

        axiosInstance('projects')
          .then((res) => res.data)
          .then((res) => {
            const allProjects = res.filter((project) => !project.deleteAt);
            allProjects.forEach((project) => {
              var isExist = project.member.find((m) => m.id === id);
              if (isExist) {
                setProjects((prev) => [...prev, project]);
              }
            });
          });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  function createCV() {
    const dateString = dataCV?.createdAt;
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const formattedDate = `${month}/${year}`;

    const test = [
      {
        name: 'project name',
      },
    ];

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: dataCV?.name,
                  bold: true,
                  size: 30,
                  color: '333333',
                }),
              ],
              spacing: {
                line: 400,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Address: ' + dataCV?.address,
                  size: 24,
                  color: '444444',
                }),
              ],
              spacing: {
                line: 360,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Email: ' + dataCV?.email,
                  size: 24,
                  color: '444444',
                }),
              ],
              spacing: {
                line: 360,
              },
            }),
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: 'WORKING EXPERIENCE',
                  bold: true,
                  size: 30,
                  color: '333333',
                }),
              ],
              spacing: {
                line: 400,
                before: 600,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: formattedDate + ' - now',
                  size: 24,
                  bold: true,
                  color: '444444',
                }),
              ],
              spacing: {
                line: 360,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text:
                    dataCV?.position[0].toUpperCase() +
                    dataCV.position.slice(1) +
                    ' at DevPlus – Da Nang',
                  size: 24,
                  color: '444444',
                }),
              ],
              spacing: {
                line: 360,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: dataCV.description,
                  size: 24,
                  color: '444444',
                }),
              ],
              spacing: {
                line: 360,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Technologies: ',
                  bold: true,
                  size: 24,
                  color: '444444',
                }),
                new TextRun({
                  text: dataCV?.skills.map((k) => k.skillname).join(', '),
                  size: 24,
                  color: '444444',
                }),
              ],
              spacing: {
                line: 360,
              },
            }),
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: 'TYPICAL PROJECTS',
                  bold: true,
                  size: 30,
                  color: '333333',
                }),
              ],
              spacing: {
                line: 400,
                before: 600,
              },
            }),
            ...projects.map(
              (t) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Project Name: ' + t.name,
                      bold: true,
                      size: 24,
                      color: '444444',
                      break: 1,
                    }),
                    new TextRun({
                      text: 'Description: ' + t.description,
                      size: 24,
                      color: '444444',
                      break: 1,
                    }),
                    new TextRun({
                      text: 'Technical: ' + t.technical.join(', '),
                      size: 24,
                      color: '444444',
                      break: 1,
                    }),
                  ],
                }),
            ),
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: 'TECHNICAL SKILLS/QUALIFICATION',
                  bold: true,
                  size: 30,
                  color: '333333',
                }),
              ],
              spacing: {
                line: 400,
                before: 600,
              },
            }),
            new Table({
              width: {
                size: 5000,
                type: WidthType.DXA,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph('Skill')],
                      size: 24,
                    }),
                    new TableCell({
                      children: [new Paragraph('Experience')],
                      size: 24,
                    }),
                  ],
                }),
                ...dataCV.skills.map(
                  (s) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph(s.skillname)],
                        }),
                        new TableCell({
                          children: [new Paragraph(s.exp + ' ')],
                        }),
                      ],
                    }),
                ),
              ],
            }),
            new Paragraph({
              // heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: 'IMPORTANT CONFIDENTIALITY NOTICE: This document contains confidential and or legally privileged information. ST United reserves all rights hereunder. When distributed or transmitted, it is intended solely for the authorized use of the addressee or intended recipient. Access to this information by anyone else is unauthorized. Disclosure, copying, distribution or any action or omission taken in reliance on it is prohibited and may be unlawful. Please, report any exceptions hereto immediately to hello@stunited.vn',
                  // bold: true,
                  size: 20,
                  color: '333333',
                }),
              ],
              spacing: {
                line: 400,
                before: 600,
              },
            }),
          ],
        },
      ],
    });
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, dataCV?.name + '_CV.docx');
      // console.log('Document created successfully');
      Toast('success', t('TOAST.CREATED_CV'));
    });
  }

  // function saveDocumentToFile(doc, fileName) {
  //   // Create new instance of Packer for the docx module

  //   // Create a mime type that will associate the new file with Microsoft Word
  //   const mimeType =
  //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  //   // Create a Blob containing the Document instance and the mimeType
  //   Packer.toBlob(doc).then((blob) => {
  //     const docblob = blob.slice(0, blob.size, mimeType);
  //     // Save the file using saveAs from the file-saver package
  //     saveAs(docblob, fileName);
  //   });
  // }

  // function generateWordDocument() {
  //   // event.preventDefault();
  //   // Create a new instance of Document for the docx module
  //   let doc = new Document({
  //     styles: {
  //       paragraphStyles: [
  //         {
  //           id: 'myCustomStyle',
  //           name: 'My Custom Style',
  //           basedOn: 'Normal',
  //           run: {
  //             color: 'FF0000',
  //             italics: true,
  //             bold: true,
  //             size: 26,
  //             font: 'Calibri',
  //           },
  //           paragraph: {
  //             spacing: { line: 276, before: 150, after: 150 },
  //           },
  //         },
  //       ],
  //     },
  //     sections: [
  //       {
  //         children: [
  //           new Paragraph({ text: 'Title', heading: HeadingLevel.TITLE }),
  //           new Paragraph({
  //             text: 'Heading 1',
  //             heading: HeadingLevel.HEADING_1,
  //           }),
  //           new Paragraph({
  //             text: 'Heading 2',
  //             heading: HeadingLevel.HEADING_2,
  //           }),
  //           new Paragraph({
  //             text: 'Aliquam gravida quam sapien, quis dapibus eros malesuada vel. Praesent tempor aliquam iaculis. Nam ut neque ex. Curabitur pretium laoreet nunc, ut ornare augue aliquet sed. Pellentesque laoreet sem risus. Cras sodales libero convallis, convallis ex sed, ultrices neque. Sed quis ullamcorper mi. Ut a leo consectetur, scelerisque nibh sit amet, egestas mauris. Donec augue sapien, vestibulum in urna et, cursus feugiat enim. Ut sit amet placerat quam, id tincidunt nulla. Cras et lorem nibh. Suspendisse posuere orci nec ligula mattis vestibulum. Suspendisse in vestibulum urna, non imperdiet enim. Vestibulum vel dolor eget neque iaculis ultrices.',
  //           }),
  //           new Paragraph({
  //             text: 'This is a paragraph styled with my custom style',
  //             style: 'myCustomStyle',
  //           }),
  //         ],
  //       },
  //     ],
  //   });

  //   // Call saveDocumentToFile with the document instance and a filename
  //   saveDocumentToFile(doc, 'New Document.docx');
  // }

  return (
    <Button
      shape="round"
      icon={<FileTextOutlined />}
      className="ms-2"
      id="generate"
      onClick={() => createCV()}
    >
      CV
    </Button>
  );
};

export default CreateCV;
