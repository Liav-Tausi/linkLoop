import { InputAdornment, InputBase } from "@mui/material";
import { useContext, useEffect } from "react";
import { AppContext } from "../../../../App/AppStates/AppReducer";

const SignFieldTemp = (props) => {
    const { themeMode } = useContext(AppContext);


    useEffect(()=> {
      console.log("SignFieldTemp refresh");
    },[])

  return (
    <InputBase
      fullWidth={true}
      required={true}
      type={props.type}
      position={"fixed"}
      placeholder={props.placeholder}
      autoComplete={props.autocomplete}
      multiline={props.multiline}
      rows={props.rows}
      sx={{
        border: `solid 1px ${
          props.sign && props.error
            ? themeMode.appTheme
            : themeMode.buttonBorder
        }`,
        backgroundColor: themeMode.signUpField,
        borderRadius: "25px",
        p: props.padding,
        pl: props.paddingL,
        "& input::placeholder": {
          opacity: 1,
        },
        "&:hover": {
          backgroundColor: themeMode.signUpFieldHover,
        },
      }}
      value={props.sign}
      onChange={props.handleChange}
      inputProps={{ style: { color: themeMode.signUpFieldText } }}
      endAdornment={
        <InputAdornment position="end">{props.children}</InputAdornment>
      }
    />
  );
}

export default SignFieldTemp;