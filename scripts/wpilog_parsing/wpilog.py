from __future__ import annotations

from bisect import bisect_right
from dataclasses import dataclass
from typing import Any, Callable, Dict, Iterator, NamedTuple, List, Optional
from wpiutil.log import DataLogReader, DataLogRecord

_DECODERS: Dict[str, Callable[[DataLogRecord], Any]] = {
    "boolean": DataLogRecord.getBoolean,
    "int64": DataLogRecord.getInteger,
    "float": DataLogRecord.getFloat,
    "double": DataLogRecord.getDouble,
    "string": DataLogRecord.getString,
    "json": DataLogRecord.getString,
    "boolean[]": DataLogRecord.getBooleanArray,
    "int64[]": DataLogRecord.getIntegerArray,
    "float[]": DataLogRecord.getFloatArray,
    "double[]": DataLogRecord.getDoubleArray,
    "string[]": DataLogRecord.getStringArray,
}


class TimedValue(NamedTuple):
    timestampSeconds: float
    value: Any


class Signal:

    def __init__(self, name: str, type_: str, metadata: str = ""):
        self.name = name
        self.type = type_
        self.metadata = metadata
        self._values: List[Any] = []
        self._times: List[float] = []

    def differentiate(self):
        differentiated_signal = Signal(f"differentiated {self.name}", self.type, self.metadata)
        for (current_time, current_value), (next_time, next_value) in pairwise(self):
            differentiated_signal.append(next_time, (next_value - current_value) / (next_time - current_time))

    def append(self, timestamp: float, value: Any) -> None:
        self._values.append(value)
        self._times.append(timestamp)

    def __iter__(self) -> Iterator[TimedValue]:
        return map(TimedValue, self._times, self._vals)

    def __len__(self) -> int:
        return len(self._values)

    def __getitem__(self, i):
        if isinstance(i, slice):
            return list(map(TimedValue, self._times[i], self._vals[i]))
        return TimedValue(self._times[i], self._vals[i])

    def __repr__(self) -> str:
        return f"Signal({self.name!r}, type={self.type!r}, samples={len(self)})"

    @property
    def timestamps(self) -> List[float]:
        return list(self._times)

    @property
    def values(self) -> List[Any]:
        return list(self._values)

    def at(self, time: float) -> Optional[Any]:
        index = bisect_right(self._times, time) - 1
        return self._values[index] if index else None


class WpiLog:

    def __init__(self):
        self._signals: Dict[str, Signal] = {}

    @classmethod
    def load(cls, path: str) -> "WpiLog":
        reader = DataLogReader(path)
        if not reader.isValid():
            raise ValueError(f"{path} is not a valid WPILOG file")

        log = cls()
        entries: Dict[int, Signal] = {}

        for record in reader:
            if record.isStart():
                start = record.getStartData()
                signal = log._signals.get(start.name)
                if signal is None:
                    signal = Signal(start.name, start.type, start.metadata)
                    log._signals[start.name] = signal
                entries[start.entry] = signal
            elif record.isFinish():
                entries.pop(record.getFinishEntry(), None)
            elif record.isSetMetadata():
                data = record.getSetMetadataData()
                signal = entries.get(data.entry)
                if signal:
                    signal.metadata = data.metadata
            elif record.isControl():
                continue
            else:
                signal = entries.get(record.getEntry())
                if signal is None:
                    continue
                decode = _DECODERS.get(signal.type, DataLogRecord.getRaw)
                try:
                    value = decode(record)
                except (TypeError, ValueError):
                    continue
                signal.append(record.getTimestamp() / 1e6, value)

        return log

    def __getitem__(self, name: str) -> Signal:
        return self._signals[name]

    def get(self, name: str, default=None):
        return self._signals.get(name, default)

    def __contains__(self, name: str) -> bool:
        return name in self._signals

    def __iter__(self) -> Iterator[Signal]:
        return iter(self._signals.values())

    def __len__(self) -> int:
        return len(self._signals)

    def names(self) -> List[str]:
        return list(self._signals)

    def items(self):
        return self._signals.items()
