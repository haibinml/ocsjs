import { defineComponent, ref } from 'vue';
import { store } from '../../script';
import { autoClose, switchPlaybackRate } from '../../script/zhs/study';
import { Tooltip } from '../Tooltip';

export const StudySettingPanel = defineComponent({
  setup () {
    const settings = store.setting.zhs.video;
    const closeDate = new Date();
    closeDate.setMinutes(closeDate.getMinutes() + settings.watchTime * 60);
    settings.closeDate = closeDate;

    // 切换倍速防抖
    const switching = ref(false);

    return () => (
      <div class="ocs-setting-panel">
        <div class="ocs-setting-items">
          {settings.creditStudy === false
            ? [
              <label>自动暂停</label>,
              <div>
                <Tooltip title="播放时间到后, 将会自动暂停。\n如设置为0, 则不会自动暂停\n自动暂停可以帮助你获取智慧树的平时分，每天学习超过半小时就算一次平时分。">
                  <input
                    type="number"
                    value={settings.watchTime}
                    min="0"
                    max="24"
                    step="0.5"
                    onChange={(e: any) => {
                      settings.watchTime = e.target.valueAsNumber;
                      const closeDate = new Date();
                      closeDate.setMinutes(closeDate.getMinutes() + settings.watchTime * 60);
                      settings.closeDate = closeDate;
                      autoClose(e.target.valueAsNumber);
                    }}
                  ></input>
                </Tooltip>
                <span>小时</span>
              </div>,

              <label>暂停时间</label>,
              <div>
                {settings.watchTime === 0
                  ? (
                    <span>设置为0将不会自动暂停</span>
                  )
                  : (
                    <span>将在 {settings.closeDate.toLocaleString()} 暂停</span>
                  )}
              </div>
            ]
            : []}

          {
            settings.creditStudy === true
              ? <>
                <label>视频倍速 </label>
                <div>
                  <Tooltip title="学分课不允许倍速！">
                    <input
                      type="number"
                      value="1"
                    >
                    </input>
                  </Tooltip>
                </div>
              </>
              : <>
                <label>视频倍速 </label>
                <div>
                  <Tooltip title="智慧树最高1.5倍速, 超过1.5容易封号！">
                    <input type="number"
                      step="0.25"
                      max="1.5"
                      min="1"
                      value={settings.playbackRate}
                      disabled={switching.value}
                      onChange={async (e:any) => {
                        switching.value = true;
                        settings.playbackRate = e.target.valueAsNumber;
                        await switchPlaybackRate(settings.playbackRate);
                        switching.value = false;
                      }}></input>
                  </Tooltip>
                </div>
              </>
          }

          <label>音量调节</label>
          <div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onInput={(e: any) => {
                settings.volume = e.target.valueAsNumber;
                if (store.currentMedia) store.currentMedia.volume = e.target.valueAsNumber;
              }}
            ></input>
            <span> {Math.round(settings.volume * 100)}% </span>
          </div>

          <label>复习模式</label>
          <div>
            <Tooltip title="将播放过的视频再播放一遍。">
              <input
                type="checkbox"
                checked={settings.restudy}
                onChange={(e: any) => (settings.restudy = e.target.checked)}
              ></input>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
});
