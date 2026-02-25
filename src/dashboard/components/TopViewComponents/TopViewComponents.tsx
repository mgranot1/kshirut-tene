import { Box, Typography } from "@mui/material";
import React from "react";
import PercentGraph from "../../../shared/components/PercentGraph/PercentGraph";
import { calcPercent } from "../../../shared/utils/percentage.util";
import { TitleValuePair } from "../../types/topview.types";
import "./TopViewComponents.scss";

interface ITitleValueCard {
  title: string;
  value: string;
  disabled?: boolean;
  subText: string;
  footer?: JSX.Element;
}

export type TTitleValueCardProps = Partial<ITitleValueCard> &
  React.HTMLAttributes<HTMLDivElement>;

export const TitleValueCard: React.FC<TTitleValueCardProps> = ({
  title,
  value,
  subText: subValue,
  footer,
  disabled,
  ...props
}) => {
  return (
    <Box
      className={`${props.className} title-value-card small ${!disabled ? "active" : ""}`}
    >
      <article {...props}>
        <Typography
          className="title-value-card-title"
          fontWeight="500"
          gutterBottom
        >
          {title}
        </Typography>
        <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Typography
            className="title-value-card-value"
            fontSize="1.8rem"
            fontWeight={800}
          >
            {value}
          </Typography>
          <Typography className="title-value-card-subvalue" fontWeight={400}>
            {subValue}
          </Typography>
        </span>
        {footer ? footer : <></>}
      </article>
    </Box>
  );
};

export const TitleDivCard: React.FC<TTitleValueCardProps> = ({
  title,
  children,
  ...props
}) => {
  return (
    <Box className={`${props.className} title-value-card small`}>
      <article {...props}>
        <Typography
          className="title-value-card-title"
          fontWeight="500"
          gutterBottom
        >
          {title}
        </Typography>
        <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {children}
        </span>
      </article>
    </Box>
  );
};

interface ITitleValueArrayCard<T> {
  arr: TitleValuePair<T>[];
  disabled?: boolean;
  value: (item: T) => number | string;
}

export type TTitleValueArrayCard<T> = ITitleValueArrayCard<T> &
  React.HTMLAttributes<HTMLDivElement>;

export function TitleValueArrayCard<T>({
  arr,
  value,
  disabled,
  ...props
}: TTitleValueArrayCard<T>) {
  return (
    <Box
      className={` title-value-card ${props.className} ${!disabled ? "active" : ""}`}
    >
      <article {...props}>
        {arr.map((entry, index) => (
          <div
            className="title-value-card-entry"
            key={`${entry.title}-${index}`}
          >
            <Typography
              className="title-value-card-title"
              fontWeight={500}
              gutterBottom
            >
              {entry.title}
            </Typography>
            <Typography className="title-value-card-value" fontWeight={800}>
              {`${value(entry.value)} ${entry.valueDesc ?? ""} `}
            </Typography>
            {entry.subtitle ? (
              <Typography
                className="title-value-card-subtitle"
                fontWeight={400}
              >
                {entry.subtitle}
              </Typography>
            ) : (
              <></>
            )}
          </div>
        ))}
      </article>
    </Box>
  );
}

interface ITitleValueGraphCard {
  title: string;
  sum: number;
  total: number;
  disabled?: boolean;
}

export type TTitleValueGraphCard = ITitleValueGraphCard &
  React.HTMLAttributes<HTMLDivElement>;

export const TitleValueGraphCard: React.FC<TTitleValueGraphCard> = ({
  title,
  sum,
  total,
  disabled,
  ...props
}) => {
  const percent = calcPercent(sum, total);

  return (
    <Box
      className={`${props.className} title-value-card small ${!disabled ? "active" : ""}`}
    >
      <article {...props}>
        <Typography
          className="title-value-card-title"
          fontWeight="500"
          gutterBottom
        >
          {title}
        </Typography>
        <span
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Typography
            className="title-value-card-value"
            fontSize="1.8rem"
            fontWeight={800}
          >
            {percent}%
          </Typography>
          <div style={{ width: "100%" }}>
            <PercentGraph percent={percent} amountAll={total} amountNotKashir={total- sum} />
          </div>
          <p
            className="title-value-card-subvalue"
            style={{ fontWeight: "500", fontSize: "0.75rem" }}
          >
            {`${sum} כשירים מתוך ${total}`}
          </p>
        </span>
      </article>
    </Box>
  );
};
