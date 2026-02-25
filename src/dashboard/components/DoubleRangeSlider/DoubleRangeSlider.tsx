import * as Slider from "@radix-ui/react-slider";
import "./DoubleRangeSlider.scss";

interface IDoubleRangeSliderProps {
  valueRange: [number, number];
  setValueRange: (newValue: [number, number]) => void;
}

const DoubleRangeSlider = ({
  valueRange,
  setValueRange,
}: IDoubleRangeSliderProps) => {
  return (
    <div className="doubleRangeSlider">
      <div className="doubleRangeSlider__wrapper">
        <Slider.Root
          className="doubleRangeSlider__root"
          value={valueRange}
          onValueChange={setValueRange}
          min={0}
          max={100}
          step={1}
        >
          <Slider.Track className="doubleRangeSlider__track">
            <div
              className="doubleRangeSlider__track--left"
              style={{ width: `${valueRange[0]}%` }}
            ></div>
            <div
              className="doubleRangeSlider__track--middle"
              style={{
                left: `${valueRange[0]}%`,
                width: `${valueRange[1] - valueRange[0]}%`,
              }}
            ></div>
            <div
              className="doubleRangeSlider__track--right"
              style={{ left: `${valueRange[1]}%` }}
            ></div>
          </Slider.Track>
          <Slider.Thumb className="doubleRangeSlider__thumb left-thumb">
            <div className="thumb__value">{valueRange[0]}%</div>
          </Slider.Thumb>
          <Slider.Thumb className="doubleRangeSlider__thumb right-thumb">
            <div className="thumb__value">{valueRange[1]}%</div>
          </Slider.Thumb>
        </Slider.Root>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
