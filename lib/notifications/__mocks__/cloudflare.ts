// Import this named export into your test file:
export const mockKvBrowse = jest.fn();
export const mockKvAdd = jest.fn();
export const mockKvRead = jest.fn();
export const mockKvDel = jest.fn();
export const mockKvAddMulti = jest.fn();
export const mockKvDelMulti = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        enterpriseZoneWorkersKV: {
            browse: mockKvBrowse,
            add: mockKvAdd,
            read: mockKvRead,
            del: mockKvDel,
            addMulti: mockKvAddMulti,
            delMulti: mockKvDelMulti,
        }
    };
});

export default mock;