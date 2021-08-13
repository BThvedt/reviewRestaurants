import React, { FC, useState } from "react"
import { useEffect } from "react"

interface IProps {
  duration?: number
  steps?: number
  currentStep?: number
  colorClass?: string
  fillColorClass?: string
}

const ProgressBar: FC<IProps> = ({
  duration,
  steps,
  currentStep,
  colorClass,
  fillColorClass
}) => {
  let [width, setWidth] = useState(0)

  if (currentStep === undefined || currentStep < 0) {
    currentStep = 0
  }

  if (steps === undefined || steps <= 0) {
    steps = 1
  }

  if (duration === undefined || duration < 0) {
    duration = 0
  }

  useEffect(() => {
    setWidth(Math.ceil((currentStep! / steps!) * 100))
  }, [currentStep, steps])

  return (
    <div className="h-2 absolute w-full overflow-hidden">
      <div className={`w-full h-full bg-${colorClass} absolute`}></div>
      <div
        className={`h-full bg-${fillColorClass} absolute transition-all ease-out `}
        style={{ width: `${width}%`, transitionDuration: `${duration}ms` }}
      ></div>
    </div>
  )
}

ProgressBar.defaultProps = {
  duration: 300,
  steps: 1,
  currentStep: 0,
  colorClass: "gray-200",
  fillColorClass: "green-400"
}

export default ProgressBar
