/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextField as MaterialTextField, OutlinedTextFieldProps } from '@material-ui/core';

interface IProps extends OutlinedTextFieldProps {
  name: string;
  control: Control<any>;
  errors?: any;
}

const TextField: React.FC<IProps> = ({ name, control, errors = [], ...rest }) => (
  <Controller
    render={
      ({ field }) => (
        <MaterialTextField
          error={!!errors[name]}
          helperText={errors[name]?.message}
          {...rest}
          {...field}
        />
      )
    }
    control={control}
    name={name}
  />
);

export default TextField;
