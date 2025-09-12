import React, { useState, ReactElement } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import { COLORS } from "../theme/constants";

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  password?: boolean;
  icon: (hasValue: boolean) => ReactElement;
  handleBlur?: (event: any) => void;
  style?: object;
  error?: boolean;
}

const InputField = ({
  placeholder,
  value,
  onChangeText,
  password,
  icon,
  handleBlur,
  style,
  error = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = !!value;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: error ? "red" : isFocused ? COLORS.black : "transparent",
          borderWidth: 1,
        },
      ]}
    >
      <View>{icon(hasValue)}</View>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder2}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        selectionColor={COLORS.black}
        cursorColor={COLORS.black}
        secureTextEntry={password && !showPassword}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          if (handleBlur) {
            handleBlur(e);
          }
        }}
      />

      {password && (
        <TouchableOpacity
          style={styles.eyeBtn}
          activeOpacity={0.8}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={RFPercentage(2)}
            color={hasValue ? COLORS.black : COLORS.placeholder2}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    height: RFPercentage(6.5),
    borderRadius: RFPercentage(1.6),
    backgroundColor: COLORS.input,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginTop: RFPercentage(2),
    paddingHorizontal: RFPercentage(2),
  },
  input: {
    width: "90%",
    height: RFPercentage(6),
    paddingHorizontal: RFPercentage(1.5),
    color: COLORS.black,
    borderRadius: RFPercentage(1.6),
    fontFamily: "Regular",
    fontSize: RFPercentage(1.7),
    top: RFPercentage(0.2),
  },
  eyeBtn: {},
});
