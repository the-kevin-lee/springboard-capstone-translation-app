import React from "react";
import {render, screen, fireEvent} from '@testing-library/react';
import Main from './Main';


test('renders translate form', () => {
    render(<Main/>);
    const linkElement = screen.getByText(/Translate../i);
    expect(linkElement).toBeInTheDocument();
});

test('handles input and translation', () => {
    render(<Main />);
    const inputElement = screen.getByPlaceholderText(/Enter text to translate/i);
    const selectElement = screen.getByLabelText(/Choose a Language/i);
    const buttonElement = screen.getByText(/Translate/i);

    fireEvent.change(inputElement, {target: {value: 'Hello'}});
    fireEvent.change(selectElement, {target: {value: 'FR'}});
    fireEvent.click(buttonElement);
    
    const translatedText =  screen.findByText(/Bonjour/i);
    expect(translatedText).toBeInTheDocument();
});