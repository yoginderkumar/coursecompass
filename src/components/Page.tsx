import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SpinnerIcon } from "./Icons";

export function PageMeta({
  title,
  children,
}:
  | {
      title: string;
      children?: never;
    }
  | {
      title?: never;
      children: React.ReactNode;
    }) {
  return (
    <Helmet titleTemplate={`%s - Course Compass`}>
      {title ? <title>{title}</title> : null}
      {children}
    </Helmet>
  );
}

export function DeferRending({
  timeout = 300,
  className,
  children,
}: {
  timeout?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [render, setRender] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setRender(true);
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout]);
  if (!render) {
    return (
      <div className={classNames("text-center", className)}>
        <SpinnerIcon />
      </div>
    );
  }
  return <>{children}</>;
}
