interface IContainerProps {
  children?: React.ReactChild | React.ReactNode;
  className?: string;
}
function Container({ children, className = "container" }: IContainerProps) {
  return <div className={className}>{children}</div>;
}
export default Container;
