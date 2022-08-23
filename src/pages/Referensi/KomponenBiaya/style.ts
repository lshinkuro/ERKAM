import styled from "styled-components";

export const Main = styled.div.attrs({
  className: "m-5 p-5 bg-white shadow-md rounded",
})``;

export const WrapSelect = styled.div.attrs({
  className: "flex justify-center items-center",
})``;
export const LabelSelect = styled.div.attrs({
  className: "mr-2 text-sm block",
})``;

export const HeadTable = styled.div.attrs({
  className: "flex flex-row justify-end my-3",
})``;

export const CustomStyles = {
  rows: {
    style: {
      minHeight: "45px", // override the row height
    },
  },
  headCells: {
    style: {
      backgroundColor: "#1b6fbb",
      textTransform: "uppercase",
      color: "white",
    },
  },
};
