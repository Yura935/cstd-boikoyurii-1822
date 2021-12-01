import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  const pipe = new FilterPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return full array if field is not definend', () => {
    expect(pipe.transform([{ userName: 'Bob' }, { userName: 'Roman' }, { userName: 'Zenyk' }], '')).toEqual([{ userName: 'Bob' }, { userName: 'Roman' }, { userName: 'Zenyk' }])
  })

  it('should return [] if value is not definend', () => {
    expect(pipe.transform(null, 'Bob')).toEqual([])
  })

  it('should transform', () => {
    expect(pipe.transform([{ userName: 'Bob' }, { userName: 'Roman' }, { userName: 'Zenyk' }], 'o')).toEqual([{ userName: 'Bob' }, { userName: 'Roman' }])
  })
});
