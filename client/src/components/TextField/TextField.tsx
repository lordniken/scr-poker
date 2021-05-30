/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextField as MaterialTextField, OutlinedTextFieldProps, Box } from '@material-ui/core';
import { textFieldStyles } from './styles';

interface IProps extends OutlinedTextFieldProps {
  name: string;
  control: Control<any>;
  errors?: any;
}

const TextField: React.FC<IProps> = ({ name, control, errors = [], ...rest }) => {
  const styles = textFieldStyles();

  return (
    <Controller
      render={
        ({ field }) => (
          <Box className={styles.container}>
            <MaterialTextField
              error={!!errors[name]}
              helperText={errors[name]?.message}
              {...rest}
              {...field}
            />
          </Box>
        )
      }
      control={control}
      name={name}
    />
  );
};

export default TextField;
