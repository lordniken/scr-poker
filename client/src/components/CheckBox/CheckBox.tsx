/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Checkbox as MaterialCheckbox, CheckboxProps } from '@material-ui/core';

interface IProps extends CheckboxProps {
  name: string;
  control: Control<any>;
  errors?: any;
}

const CheckBox: React.FC<IProps> = ({ name, control, ...rest }) => (
  <Controller
    render={
      ({ field }) => (
        <MaterialCheckbox
          {...rest}
          {...field}
        />
      )
    }
    control={control}
    name={name}
  />
);

export default CheckBox;
