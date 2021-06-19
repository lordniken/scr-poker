/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Select as MaterialSelect, SelectProps } from '@material-ui/core';

interface IProps extends SelectProps {
  name: string;
  control: Control<any>;
  errors?: any;
}

const Select: React.FC<IProps> = ({ name, control, errors = [], ...rest }) => (
  <Controller
    render={
      ({ field }) => (
        <MaterialSelect
          error={!!errors[name]}
          {...rest}
          {...field}
        />
      )
    }
    control={control}
    name={name}
  />
);

export default Select;
