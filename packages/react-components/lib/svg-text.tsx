import React from 'react';

export interface SvgTextProps extends React.SVGProps<SVGTextElement> {
  text: string;
  targetWidth: number;
}

/**
 * A wrapper to `<text>` element that attempts to fix text into a given width, ellipsing it if it
 * is too long. Unlike the `textLength` attribute, this does not "compress" or "expand" the text.
 * @param props
 */
export const SvgText = (props: SvgTextProps): JSX.Element => {
  const { text, targetWidth, ...otherProps } = props;
  const callbackRef = (textElem: SVGTextElement | null) => {
    if (!textElem) {
      return;
    }

    // svg text does not support auto ellipses, this workaround by testing the text length and
    // truncate it bit by bit until it fits the icon. It's a bit hacky but it shouldn't be too bad
    // unless the robot name is mega long.
    for (textElem.textContent = text; textElem.getComputedTextLength() > targetWidth; ) {
      textElem.textContent = textElem.textContent.slice(0, textElem.textContent.length - 6) + '…';
    }
  };

  return <text ref={callbackRef} {...otherProps} />;
};

export default SvgText;
