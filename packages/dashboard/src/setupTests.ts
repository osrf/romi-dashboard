import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '@testing-library/jest-dom';

Enzyme.configure({ adapter: new Adapter() });

/**
 * Assigning global object to have a type of any as
 * typescript does not allow access to the window object
 */
const globalAny: any = global;
class MockEncoder {
  encode() {
    return jest.fn();
  }
}
const mockCrypto = { subtle: { digest: () => jest.fn() } };

globalAny.window.TextEncoder = MockEncoder;
globalAny.window.crypto = mockCrypto;
