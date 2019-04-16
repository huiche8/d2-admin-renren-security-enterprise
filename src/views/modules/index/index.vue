<style lang="scss" scoped>
.page {
  p {
    &:first-child {
      margin-top: 0px;
    }
    b {
      color: $color-text-main;
      margin-right: 10px;
    }
    span {
      color: $color-text-normal;
    }
  }
}
</style>

<template>
  <d2-container class="page">
    <p>
      <b>{{ $t('home.sysInfo.name') }}</b>
      <span>{{ $t('home.sysInfo.nameVal') }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.version') }}</b>
      <span>{{ $t('home.sysInfo.versionVal') }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.osName') }}</b>
      <span>{{ sysInfo.osName }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.osVersion') }}</b>
      <span>{{ sysInfo.osVersion }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.osArch') }}</b>
      <span>{{ sysInfo.osArch }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.processors') }}</b>
      <span>{{ sysInfo.processors }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.totalPhysical') }}</b>
      <span>{{ sysInfo.totalPhysical }}MB</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.freePhysical') }}</b>
      <span>{{ sysInfo.freePhysical }}MB</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.memoryRate') }}</b>
      <span>{{ sysInfo.memoryRate }}%</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.userLanguage') }}</b>
      <span>{{ sysInfo.userLanguage }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.jvmName') }}</b>
      <span>{{ sysInfo.jvmName }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.javaVersion') }}</b>
      <span>{{ sysInfo.javaVersion }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.javaHome') }}</b>
      <span>{{ sysInfo.javaHome }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.userDir') }}</b>
      <span>{{ sysInfo.userDir }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.javaTotalMemory') }}</b>
      <span>{{ sysInfo.javaTotalMemory }}MB</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.javaFreeMemory') }}</b>
      <span>{{ sysInfo.javaFreeMemory }}MB</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.javaMaxMemory') }}</b>
      <span>{{ sysInfo.javaMaxMemory }}MB</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.userName') }}</b>
      <span>{{ sysInfo.userName }}</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.systemCpuLoad') }}</b>
      <span>{{ sysInfo.systemCpuLoad }}%</span>
    </p>
    <p>
      <b>{{ $t('home.sysInfo.userTimezone') }}</b>
      <span>{{ sysInfo.userTimezone }}</span>
    </p>
  </d2-container>
</template>

<script>
import { sysInfoService } from '@/common/api'
export default {
  data () {
    return {
      sysInfo: {
        osName: '',
        osVersion: '',
        osArch: '',
        processors: 0,
        totalPhysical: 0,
        freePhysical: 0,
        memoryRate: 0,
        userLanguage: '',
        jvmName: '',
        javaVersion: '',
        javaHome: '',
        userDir: '',
        javaTotalMemory: 0,
        javaFreeMemory: 0,
        javaMaxMemory: 0,
        userName: '',
        systemCpuLoad: 0,
        userTimezone: ''
      }
    }
  },
  created () {
    this.getSysInfo()
  },
  methods: {
    getSysInfo () {
      sysInfoService
        .get()
        .then(res => {
          this.sysInfo = res
        })
        .catch(() => {})
    }
  }
}
</script>
