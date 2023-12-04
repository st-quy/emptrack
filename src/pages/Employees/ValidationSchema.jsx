import * as Yup from 'yup';

export const validationSchema = Yup.object({
  code: Yup.string()
    .matches(/^DL\d{3}$/, 'Mã sinh viên phải bắt đầu bằng DL và 3 chữ số')
    .required('Vui lòng nhập mã sinh viên'),
  nameEmployee: Yup.string()
    .required('Vui lòng nhập tên')
    .matches(
      /^[A-Z][a-z]*(\s+[A-Z][a-z]*)*$/,
      'Họ tên phải bắt đầu bằng chữ hoa và cách nhau bằng một khoảng trắng',
    )
    .matches(/^([^ ]* [^ ]*)$/, 'Tên chỉ được chứa 1 khoảng trắng')
    .matches(/^[A-Za-z\s]+$/, 'Tên không được chứa số và kí tự đặc biệt'),
  phone: Yup.string()
    .matches(/^0\d{9}$/, 'Số điện thoại không hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  gender: Yup.string().required('Vui lòng chọn giới tính'),
  status: Yup.string().required('Vui lòng chọn trạng thái'),
  is_manager: Yup.boolean().required('Bạn có phải người quản lí không?'),
  position: Yup.string().required('Vui lòng chọn vị trí'),
  line_manager: Yup.string().required('Vui lòng nhập tên người quản lí'),
  birth: Yup.date()
    .max(new Date(), 'Ngày sinh không được lớn hơn ngày hiện tại')
    .required('Vui lòng chọn năm sinh'),
  description: Yup.string().required('Vui lòng điền mô tả'),
  citizen_card: Yup.string()
    .matches(/^[0-9]{10}$/, 'Số căn cước bắt buộc phải 10 số')
    .required('Vui lòng nhập số căn cước'),
  skills: Yup.array().of(
    Yup.object().shape({
      skillname: Yup.string().required('Vui lòng nhập tên kỹ năng'),
      exp: Yup.string().required('Vui lòng nhập kinh nghiệm'),
    }),
  ),
});
