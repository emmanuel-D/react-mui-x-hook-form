# ⚛️ React MUI X Hook Form

A collection of **reusable React components** that seamlessly integrate **Material UI (MUI)** with **React Hook Form** – making it easier than ever to build powerful, accessible, and elegant forms.  
It also includes a variety of utility components to boost your development workflow 🚀

---

## ✨ Features

- **Easy Integration** – Combine the flexibility of React Hook Form with the rich UI of MUI effortlessly.
- **Reusable Form Components** – Typed, customizable inputs including:
  - `Checkbox`
  - `DatePicker`
  - `InputField`
  - `RadioGroup`
  - `Switch`
  - `TextArea`
- **Utility Components** – Enhance your app's UX with:
  - `DateTimeAgo`, `ElapsedDuration`, `TimeAgo`
  - `SmallDivider`, `SwiperDivider`
  - `AppColorPicker`, `ConfirmDialog`, `NavBar`
  - `AutoCompleteSearchModal`, `AutoCompleteWithMultiSelectSearchModal`
  - `MentionAndTagPicker`, `TypingAnimation`, `ScrollToTopButton`, `SectionDivider`
- **📦 TypeScript Support** – Full type definitions included for maximum DX.

---

## 📦 Installation

Install the package via npm:

```bash
npm install @manu_omg/react-mui-x-hook-form
````

Or with Yarn:

```bash
yarn add @manu_omg/react-mui-x-hook-form
```

---

## 📎 Peer Dependencies

Make sure the following packages are **also installed** in your project:

```bash
npm install @mui/material @mui/icons-material @mui/x-date-pickers \
react react-dom react-hook-form \
@emotion/react @emotion/styled
```

> ✅ Versions supported:

```json
{
  "@mui/icons-material": "^5 || ^6 || ^7",
  "@mui/material": "^5 || ^6 || ^7",
  "@mui/x-date-pickers": "^6 || ^7 || ^8",
  "react": "^18 || ^19",
  "react-dom": "^18 || ^19",
  "react-hook-form": "^7.0.0",
  "@emotion/react": "^11.0.0",
  "@emotion/styled": "^11.0.0"
}
```

---

## 📘 Usage Example

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '@manu_omg/react-mui-x-hook-form';
import { Button } from '@mui/material';

const MyForm = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        name="email"
        control={control}
        label="Email"
        rules={{ required: 'Email is required' }}
      />
      <Button type="submit" variant="contained">Submit</Button>
    </form>
  );
};

export default MyForm;
```

---

## 📂 Per-Component Imports (Optional)

You can also import components individually if you prefer:

```tsx
import { DatePicker } from '@manu_omg/react-mui-x-hook-form';
```

---

## 🤝 Contributing

Found a bug or want to add a new feature?
Pull requests and issues are very welcome!

1. Fork the repo
2. Create a new branch
3. Submit your changes via PR

---

## 📄 License

MIT – Use it freely in personal or commercial projects.

---

Made with ❤️ by [@manu\_omg](https://github.com/emmanuel-D)