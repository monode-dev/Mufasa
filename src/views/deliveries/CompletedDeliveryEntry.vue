<script setup lang="ts"></script>

<template>
  <Card :sty="{ width: `1f` }">
    <Row
      :sty="{
        width: `1f`,
        spacing: $Spacing.spaceBetween,
      }"
    >
      <Text hint :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
        >Tue, March 10th 2021</Text
      >
      <DeleteOptionsButton />
    </Row>
    <Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
      >12345 - Client A</Text
    >

    <Row
      :sty="{
        width: `1f`,
        spacing: 0.25,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
          >10.589</Text
        >
        <Text :sty="{ height: 1 }">of:</Text>
      </Row>
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Text
          :sty="{
            width: `1f`,
            align: $Align.centerLeft,
            height: 1,
          }"
          >GAUL</Text
        >
        <Text :sty="{ height: 1 }">to:</Text>
      </Row>
      <Row
        :sty="{
          width: `1f`,
          align: $Align.centerLeft,
          spacing: 0.25,
        }"
      >
        <Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
          >Tank B</Text
        >
      </Row>
    </Row>
    <Row
      :sty="{
        width: `1f`,
        spacing: 0.25,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Text :sty="{ height: 1 }">Rate:</Text>
        <Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
          >$4.391</Text
        >
      </Row>
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Text :sty="{ height: 1 }">Total:</Text>
        <Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
          >$46.50</Text
        >
      </Row>
    </Row>
  </Card>
</template>
